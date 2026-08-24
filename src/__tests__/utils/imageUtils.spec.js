import { describe, it, expect, vi, afterEach } from 'vitest'
import { processImageFiles } from '@/utils/imageUtils.js'

function stubImageBitmap(width, height) {
  vi.stubGlobal('createImageBitmap', vi.fn(() => Promise.resolve({ width, height })))
}

function stubCanvas() {
  const drawImage = vi.fn()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage })
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (cb) {
    cb(new Blob(['fake-jpeg-bytes'], { type: 'image/jpeg' }))
  })
  return { drawImage }
}

function makeImageFile(name = 'photo.jpg') {
  return new File(['x'], name, { type: 'image/jpeg' })
}

describe('processImageFiles', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('produces one processed JPEG file per input image', async () => {
    stubImageBitmap(4000, 3000)
    stubCanvas()

    const { processedFiles, error } = await processImageFiles([makeImageFile()], [], ['top.jpg'])

    expect(error).toBeNull()
    expect(processedFiles).toHaveLength(1)
    expect(processedFiles[0].type).toBe('image/jpeg')
  })

  it('does not upscale an image already smaller than the max dimension', async () => {
    stubImageBitmap(800, 600)
    const { drawImage } = stubCanvas()

    await processImageFiles([makeImageFile()], [], ['top.jpg'])

    // drawImage's target width/height (3rd/4th args) should match the original size
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 800, 600)
  })

  it('scales the long edge down to MAX_DIMENSION and keeps aspect ratio for the short edge', async () => {
    stubImageBitmap(4000, 3000)
    const { drawImage } = stubCanvas()

    await processImageFiles([makeImageFile()], [], ['top.jpg'])

    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1920, 1440)
  })

  it('renames processed files based on the provided custom names', async () => {
    stubImageBitmap(800, 600)
    stubCanvas()

    const { processedFiles } = await processImageFiles([makeImageFile()], [], ['angle_top.jpg'])

    expect(processedFiles[0].name).toBe('angle_top.jpg')
    expect(processedFiles[0].type).toBe('image/jpeg')
  })
})
