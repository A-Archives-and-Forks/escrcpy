/**
 * Layout management composable
 * Handles loading and creating widget layouts
 */
export function useLayoutManagement(scaleConverter, arrangedWidgets, allDevices) {
  const createWidgetFromConfig = (config, widgetData) => {
    const realWidth = Number.parseInt(config['--window-width']) || 300
    const realHeight = Number.parseInt(config['--window-height']) || 600
    const realX = Number.parseInt(config['--window-x']) || 0
    const realY = Number.parseInt(config['--window-y']) || 0

    const containerRect = scaleConverter({ width: realWidth, height: realHeight, x: realX, y: realY })

    return {
      ...widgetData,
      x: containerRect.x,
      y: containerRect.y,
      width: containerRect.width,
      height: containerRect.height,
      realX,
      realY,
      realWidth,
      realHeight,
    }
  }

  const loadLayout = () => {
    arrangedWidgets.value = []
    const scrcpy = window.appStore.get('scrcpy')

    // Load global widget
    const globalConfig = scrcpy.global || {}
    if (globalConfig['--window-width'] && globalConfig['--window-height']) {
      const widget = createWidgetFromConfig(globalConfig, {
        id: 'global',
        type: 'global',
        name: 'Global',
      })
      arrangedWidgets.value.push(widget)
    }

    // Load device widgets
    allDevices.value.forEach((device) => {
      const deviceConfig = scrcpy[device.id] || {}
      if (deviceConfig['--window-width'] && deviceConfig['--window-height']) {
        const widget = createWidgetFromConfig(deviceConfig, {
          id: device.id,
          type: 'device',
          deviceId: device.id,
          name: device.name || device.model?.split(':')[1] || device.id,
        })
        arrangedWidgets.value.push(widget)
      }
    })
  }

  return {
    loadLayout,
    createWidgetFromConfig,
  }
}
