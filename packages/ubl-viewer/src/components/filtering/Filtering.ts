export const GREYSCALE = () => {
  return (context, callback) => {
    const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    const pixels = imgData.data
    for (let i = 0; i < pixels.length; i += 4) {
      const val = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
      pixels[i] = val
      pixels[i + 1] = val
      pixels[i + 2] = val
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export const BRIGHTNESS = (adjustment) => {
  if (adjustment < -255 || adjustment > 255) {
    throw new Error('Brightness adjustment must be between -255 and 255.')
  }
  const precomputedBrightness = []
  for (let i = 0; i < 256; i++) {
    precomputedBrightness[i] = i + adjustment
  }
  return (context, callback) => {
    const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    const pixels = imgData.data
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = precomputedBrightness[pixels[i]]
      pixels[i + 1] = precomputedBrightness[pixels[i + 1]]
      pixels[i + 2] = precomputedBrightness[pixels[i + 2]]
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export const THRESHOLDING = (threshold) => {
  if (threshold < 0 || threshold > 255) {
    throw new Error('Threshold must be between 0 and 255.')
  }
  return (context, callback)  => {
    const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    const pixels = imgData.data
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      const v = (r + g + b) / 3
      pixels[i] = pixels[i + 1] = pixels[i + 2] = v < threshold ? 0 : 255
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export const CONTRAST = (adjustment) => {
  if (adjustment < 0) {
    throw new Error('Contrast adjustment must be positive.')
  }
  const precomputedContrast = []
  for (let i = 0; i < 256; i++) {
    precomputedContrast[i] = i * adjustment
  }
  return (context, callback) => {
    const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    const pixels = imgData.data
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = precomputedContrast[pixels[i]]
      pixels[i + 1] = precomputedContrast[pixels[i + 1]]
      pixels[i + 2] = precomputedContrast[pixels[i + 2]]
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export const GAMMA = (adjustment) => {
  if (adjustment < 0) {
    throw new Error('Gamma adjustment must be positive.')
  }
  const precomputedGamma = []
  for (let i = 0; i < 256; i++) {
    precomputedGamma[i] = Math.pow(i / 255, adjustment) * 255
  }
  return (context, callback) => {
    const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    const pixels = imgData.data
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = precomputedGamma[pixels[i]]
      pixels[i + 1] = precomputedGamma[pixels[i + 1]]
      pixels[i + 2] = precomputedGamma[pixels[i + 2]]
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export const INVERT = () => {
  const precomputedInvert = []
  for (let i = 0; i < 256; i++) {
    precomputedInvert[i] = 255 - i
  }
  return (context, callback) => {
    const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    const pixels = imgData.data
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = precomputedInvert[pixels[i]]
      pixels[i + 1] = precomputedInvert[pixels[i + 1]]
      pixels[i + 2] = precomputedInvert[pixels[i + 2]]
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export const MORPHOLOGICAL_OPERATION = (kernelSize, comparator) => {
  if (kernelSize % 2 === 0) {
    throw new Error('The kernel size must be an odd number.')
  }
  const kernelHalfSize = Math.floor(kernelSize / 2)

  if (!comparator) {
    throw new Error('A comparator must be defined.')
  }

  return (context, callback) => {
    const width = context.canvas.width
    const height = context.canvas.height
    const imgData = context.getImageData(0, 0, width, height)
    const originalPixels = context.getImageData(0, 0, width, height).data
    let offset

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        offset = (y * width + x) * 4
        let r = originalPixels[offset]
        let g = originalPixels[offset + 1]
        let b = originalPixels[offset + 2]
        for (let j = 0; j < kernelSize; j++) {
          for (let i = 0; i < kernelSize; i++) {
            const pixelX = x + i - kernelHalfSize
            const pixelY = y + j - kernelHalfSize
            if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
              offset = (pixelY * width + pixelX) * 4
              r = comparator(originalPixels[offset], r)
              g = comparator(originalPixels[offset + 1], g)
              b = comparator(originalPixels[offset + 2], b)
            }
          }
        }
        imgData.data[offset] = r
        imgData.data[offset + 1] = g
        imgData.data[offset + 2] = b
      }
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export const CONVOLUTION = (kernel) => {
  if (!Array.isArray(kernel)) {
    throw new Error('The kernel must be an array.')
  }
  const kernelSize = Math.sqrt(kernel.length)
  if ((kernelSize + 1) % 2 !== 0) {
    throw new Error('The kernel must be a square matrix with odd' + 'width and height.')
  }
  const kernelHalfSize = (kernelSize - 1) / 2

  return (context, callback) => {
    const width = context.canvas.width
    const height = context.canvas.height
    const imgData = context.getImageData(0, 0, width, height)
    const originalPixels = context.getImageData(0, 0, width, height).data
    let offset

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0
        let g = 0
        let b = 0
        for (let j = 0; j < kernelSize; j++) {
          for (let i = 0; i < kernelSize; i++) {
            const pixelX = x + i - kernelHalfSize
            const pixelY = y + j - kernelHalfSize
            if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
              offset = (pixelY * width + pixelX) * 4
              const weight = kernel[j * kernelSize + i]
              r += originalPixels[offset] * weight
              g += originalPixels[offset + 1] * weight
              b += originalPixels[offset + 2] * weight
            }
          }
        }
        offset = (y * width + x) * 4
        imgData.data[offset] = r
        imgData.data[offset + 1] = g
        imgData.data[offset + 2] = b
      }
    }
    context.putImageData(imgData, 0, 0)
    callback()
  }
}

export class Filtering {

  static addItemToReset(item, itemsToReset) {
    if (itemsToReset.indexOf(item) >= 0) {
      throw new Error('An item can not have filters ' + 'assigned multiple times.')
    }
    itemsToReset.push(item)
  }

  static getAllItems(world) {
    const result = []
    for (let i = 0; i < world.getItemCount(); i++) {
      result.push(world.getItemAt(i))
    }
    return result
  }

  viewer: any
  filterIncrement: number
  options: any
  filters: any []

  constructor(options) {
    this.options = options || {}
    if (!options.viewer) {
      throw new Error('A viewer must be specified.')
    }
    this.viewer = options.viewer

    this.viewer.addHandler('tile-loaded', this.tileLoadedHandler(options, {}))
    this.viewer.addHandler('tile-drawing', this.tileDrawingHandler(options))
    this.filterIncrement = 0

    this.setOptions(options)
  }

  setOptions(options) {
    options = options || {}
    const filters = options.filters
    options.filters = !filters ? [] : Array.isArray(filters) ? filters : [filters]
    for (const filter of options.filters) {
      if (!filter.processors) {
        throw new Error('Filter processors must be specified.')
      }
      filter.processors = Array.isArray(filter.processors) ? filter.processors : [filter.processors]
    }
    this.filterIncrement++

    if (options.loadMode === 'sync') {
      this.viewer.forceRedraw()
    } else {
      let itemsToReset = []
      for (const filter of options.filters) {
        if (!filter.items) {
          itemsToReset = Filtering.getAllItems(this.viewer.world)
          break
        }
        if (Array.isArray(filter.items)) {
          for (const j of filter.items.length) {
            Filtering.addItemToReset(filter.items[j], itemsToReset)
          }
        } else {
          Filtering.addItemToReset(filter.items, itemsToReset)
        }
      }
      for (const i of itemsToReset) {
        itemsToReset[i].reset()
      }
    }
  }

  tileLoadedHandler(options, event) {
    if (options.filters.length === 0) {
      return []
    }

    let processors = null
    for (const filter of options.filters) {
      if (!filter.items) {
        processors = filter.processors
      } else if (filter.items === event || Array.isArray(filter.items) && filter.items.indexOf(event) >= 0) {
        return filter.processors
      }
    }
    if (processors.length === 0) {
      return
    }
    const tile = event.tile
    const image = event.image
    if (image !== null && image !== undefined) {
      const canvas = window.document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      tile._renderedContext = context
      const callback = event.getCompletionCallback()
      this.applyFilters(context, processors, callback)
      tile._filterIncrement = this.filterIncrement
    }
  }

  applyFilters(context, filtersProcessors, callback) {
    if (callback) {
      const currentIncrement = this.filterIncrement
      const callbacks = []
      for (let i = 0; i < filtersProcessors.length - 1; i++) {
        ((i) => {
          callbacks[i] = () => {
            // If the increment has changed, stop the computation
            // chain immediately.
            if (this.filterIncrement !== currentIncrement) {
              return
            }
            filtersProcessors[i + 1](context, callbacks[i + 1])
          }
        })(i)
      }
      callbacks[filtersProcessors.length - 1] = () => {
        // If the increment has changed, do not call the callback.
        // (We don't want OSD to draw an outdated tile in the canvas).
        if (this.filterIncrement !== currentIncrement) {
          return
        }
        callback()
      }
      filtersProcessors[0](context, callbacks[0])
    } else {
      for (const i of filtersProcessors) {
        filtersProcessors[i](context, () => {
        })
      }
    }
  }

  tileDrawingHandler(event) {
    const tile = event.tile
    const rendered = event.rendered
    if (rendered._filterIncrement === this.filterIncrement) {
      return
    }
    if (this.options.filters.length === 0) {
      return []
    }

    let processors = null
    for (const filter of this.options.filters) {
      if (!filter.items) {
        processors = filter.processors
      } else if (filter.items === event || Array.isArray(filter.items) && filter.items.indexOf(event) >= 0) {
        return filter.processors
      }
    }
    if (processors.length === 0) {
      if (rendered._originalImageData) {
        // Restore initial data.
        rendered.putImageData(rendered._originalImageData, 0, 0)
        delete rendered._originalImageData
      }
      rendered._filterIncrement = this.filterIncrement
      return
    }

    if (rendered._originalImageData) {
      // The tile has been previously filtered (by another filter),
      // restore it first.
      rendered.putImageData(rendered._originalImageData, 0, 0)
    } else {
      rendered._originalImageData = rendered.getImageData(0, 0, rendered.canvas.width, rendered.canvas.height)
    }

    if (tile._renderedContext) {
      if (tile._filterIncrement === this.filterIncrement) {
        const imgData = tile._renderedContext.getImageData(0, 0, tile._renderedContext.canvas.width,
          tile._renderedContext.canvas.height)
        rendered.putImageData(imgData, 0, 0)
        delete tile._renderedContext
        delete tile._filterIncrement
        rendered._filterIncrement = this.filterIncrement
        return
      }
      delete tile._renderedContext
      delete tile._filterIncrement
    }
    this.applyFilters(rendered, processors, {})
    rendered._filterIncrement = this.filterIncrement
  }
}
