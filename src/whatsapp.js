const { By, Key, until } = require('selenium-webdriver')

const LOCATORS = {
  SIDE: By.id('side'),
  MAIN: By.id('main'),
  EDITABLE: By.css('div[contenteditable="true"]')
}

const isLogged = async (driver) => {
  let result = true

  try {
    const search = await driver.findElement(LOCATORS.SIDE).findElement(LOCATORS.EDITABLE)
    await driver.wait(until.elementIsVisible(search), 1000)
  } catch (e) {
    console.error(e)
    result = false
  } finally {
    return result
  }
}

const sendMessage = async (driver, phones, message) => {
  for (const phone of phones) {
    try {
      const search = await driver.findElement(LOCATORS.SIDE).findElement(LOCATORS.EDITABLE)
      await search.clear()
      await search.sendKeys(phone, Key.RETURN)

      const send = await driver.findElement(LOCATORS.MAIN).findElement(LOCATORS.EDITABLE)
      await send.clear()
      await send.sendKeys(message, Key.RETURN)
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = {
  isLogged,
  sendMessage
}
