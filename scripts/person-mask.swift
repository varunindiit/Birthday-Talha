// Generates a subject (person) alpha mask with Apple's on-device Vision framework.
// The mask only decides which pixels are kept — no pixel of the person is
// redrawn, generated or retouched. Used by scripts/prepare-photos.mjs.
//
// usage: swift scripts/person-mask.swift <input-image> <output-mask.png>

import AppKit
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: person-mask <input-image> <output-mask.png>\n".data(using: .utf8)!)
  exit(1)
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard let image = CIImage(contentsOf: inputURL) else {
  FileHandle.standardError.write("could not read \(args[1])\n".data(using: .utf8)!)
  exit(1)
}

let handler = VNImageRequestHandler(ciImage: image, options: [:])
var mask: CIImage?

// Preferred: subject lifting (full-resolution, clean hair/shoulder edges).
if #available(macOS 14.0, *) {
  let request = VNGenerateForegroundInstanceMaskRequest()
  try? handler.perform([request])
  if let observation = request.results?.first,
    let buffer = try? observation.generateScaledMaskForImage(
      forInstances: observation.allInstances, from: handler)
  {
    mask = CIImage(cvPixelBuffer: buffer)
  }
}

// Fallback: person segmentation, scaled up to the source size.
if mask == nil {
  let request = VNGeneratePersonSegmentationRequest()
  request.qualityLevel = .accurate
  request.outputPixelFormat = kCVPixelFormatType_OneComponent8
  try handler.perform([request])
  guard let buffer = request.results?.first?.pixelBuffer else {
    FileHandle.standardError.write("no person found\n".data(using: .utf8)!)
    exit(2)
  }
  let raw = CIImage(cvPixelBuffer: buffer)
  mask = raw.transformed(
    by: CGAffineTransform(
      scaleX: image.extent.width / raw.extent.width,
      y: image.extent.height / raw.extent.height))
}

let context = CIContext(options: [.workingColorSpace: NSNull()])
try context.writePNGRepresentation(
  of: mask!.cropped(to: image.extent),
  to: outputURL,
  format: .L8,
  colorSpace: CGColorSpaceCreateDeviceGray())
print("mask written: \(args[2])")
