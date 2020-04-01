const { Builder } = require('selenium-webdriver')

const startDriver = async (forBrowser, atPage) => {
  let driver = null

  try {
    driver = await new Builder().forBrowser(forBrowser).build()
    await driver.get(atPage)
  } catch (e) {
    console.error(e)
  } finally {
    return driver
  }
}

module.exports = {
  startDriver
}
