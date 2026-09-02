/*
 * Copyright (C) 2026 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Builder, By, Key, Locator, WebDriver, WebElement,} from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import {Origin} from 'selenium-webdriver/lib/input';

type AsyncCondition<T> = () => T | Promise<T>;
type ElementResolver = () => Promise<WebElement>;

function createDriver(): WebDriver {
  const options = new chrome.Options().addArguments(
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280x1024',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--enable-unsafe-swiftshader',
  );
  const service = new chrome.ServiceBuilder(
    './deps_build/chromedriver-linux64/chromedriver',
  );
  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options as never)
    .setChromeService(service)
    .build();
}

export class ElementFinder {
  constructor(private readonly resolveElement: ElementResolver) {}

  element(locator: Locator): ElementFinder {
    return new ElementFinder(async () =>
      (await this.resolveElement()).findElement(locator),
    );
  }

  click(): Promise<void> {
    return this.resolveElement().then((value) => value.click());
  }

  sendKeys(
    ...values: Array<string | number | Promise<string | number>>
  ): Promise<void> {
    return this.resolveElement().then((value) => value.sendKeys(...values));
  }

  getText(): Promise<string> {
    return this.resolveElement().then((value) => value.getText());
  }

  async getAttribute(name: string): Promise<string> {
    return (await (await this.resolveElement()).getAttribute(name)) ?? '';
  }

  getCssValue(name: string): Promise<string> {
    return this.resolveElement().then((value) => value.getCssValue(name));
  }

  async getSize(): Promise<{width: number; height: number}> {
    const rect = await (await this.resolveElement()).getRect();
    return {width: rect.width, height: rect.height};
  }

  isEnabled(): Promise<boolean> {
    return this.resolveElement().then((value) => value.isEnabled());
  }

  async isPresent(): Promise<boolean> {
    try {
      await this.resolveElement();
      return true;
    } catch {
      return false;
    }
  }

  getWebElement(): ElementFinder {
    return this;
  }

  resolve(): Promise<WebElement> {
    return this.resolveElement();
  }
}

class ElementArrayFinder implements PromiseLike<ElementFinder[]> {
  constructor(private readonly locator: Locator) {}

  private async resolve(): Promise<ElementFinder[]> {
    const values = await browser.getDriver().findElements(this.locator);
    return values.map(
      (value) => new ElementFinder(async () => Promise.resolve(value)),
    );
  }

  then<TResult1 = ElementFinder[], TResult2 = never>(
    onfulfilled?:
      | ((value: ElementFinder[]) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.resolve().then(onfulfilled, onrejected);
  }

  get(index: number): ElementFinder {
    return new ElementFinder(async () => {
      const values = await browser.getDriver().findElements(this.locator);
      const normalizedIndex = index < 0 ? values.length + index : index;
      const value = values[normalizedIndex];
      if (!value) throw new Error(`No element at index ${index}`);
      return value;
    });
  }

  first(): ElementFinder {
    return this.get(0);
  }

  last(): ElementFinder {
    return this.get(-1);
  }

  async map<T>(
    callback: (value: ElementFinder, index: number) => T | Promise<T>,
  ): Promise<T[]> {
    return Promise.all((await this.resolve()).map(callback));
  }
}

class ActionSequence {
  private readonly steps: Array<
    (actions: ReturnType<WebDriver['actions']>) => Promise<void> | void
  > = [];

  constructor(private readonly driver: WebDriver) {}

  mouseMove(
    target: ElementFinder | {x: number; y: number},
    offset?: {x: number; y: number},
  ): ActionSequence {
    this.steps.push(async (actions) => {
      if (target instanceof ElementFinder) {
        const origin = await target.resolve();
        const rect = await origin.getRect();
        actions.move({
          origin,
          x: offset === undefined ? 0 : Math.round(offset.x - rect.width / 2),
          y: offset === undefined ? 0 : Math.round(offset.y - rect.height / 2),
        });
      } else {
        actions.move({origin: Origin.POINTER, x: target.x, y: target.y});
      }
    });
    return this;
  }

  click(): ActionSequence {
    this.steps.push((actions) => {
      actions.click();
    });
    return this;
  }

  async perform(): Promise<void> {
    const actions = this.driver.actions({async: true});
    for (const step of this.steps) await step(actions);
    await actions.perform();
  }
}

class BrowserFacade {
  private currentDriver = createDriver();

  readonly driver = this;

  getDriver(): WebDriver {
    return this.currentDriver;
  }

  async restart(): Promise<void> {
    await this.currentDriver.quit();
    this.currentDriver = createDriver();
  }

  waitForAngularEnabled(_enabled: boolean): void {}

  get(url: string): Promise<void> {
    return this.currentDriver.get(url);
  }

  sleep(milliseconds: number): Promise<void> {
    return this.currentDriver.sleep(milliseconds);
  }

  manage() {
    return {
      timeouts: () => ({
        implicitlyWait: (milliseconds: number) =>
          this.currentDriver.manage().setTimeouts({implicit: milliseconds}),
        setScriptTimeout: (milliseconds: number) =>
          this.currentDriver.manage().setTimeouts({script: milliseconds}),
      }),
      window: () => this.currentDriver.manage().window(),
    };
  }

  switchTo(): ReturnType<WebDriver['switchTo']> {
    return this.currentDriver.switchTo();
  }

  getAllWindowHandles(): Promise<string[]> {
    return this.currentDriver.getAllWindowHandles();
  }

  wait<T>(
    condition: AsyncCondition<T>,
    timeout?: number,
    message?: string,
  ): Promise<T> {
    return this.currentDriver.wait(condition, timeout, message);
  }

  async executeScript<T>(script: string, ...args: unknown[]): Promise<T> {
    const resolved = await Promise.all(
      args.map((value) =>
        value instanceof ElementFinder
          ? value.resolve()
          : Promise.resolve(value),
      ),
    );
    return this.currentDriver.executeScript(script, ...resolved) as Promise<T>;
  }

  actions(): ActionSequence {
    return new ActionSequence(this.currentDriver);
  }
}

export const browser = new BrowserFacade();
export const by = {css: (selector: string): Locator => By.css(selector)};

interface ElementFactory {
  (locator: Locator): ElementFinder;
  all(locator: Locator): ElementArrayFinder;
}

export const element: ElementFactory = Object.assign(
  (locator: Locator) =>
    new ElementFinder(async () => browser.getDriver().findElement(locator)),
  {
    all: (locator: Locator) => new ElementArrayFinder(locator),
  },
);

export const ExpectedConditions = {
  presenceOf:
    (target: ElementFinder): AsyncCondition<boolean> =>
    () =>
      target.isPresent(),
  not:
    (condition: AsyncCondition<boolean>): AsyncCondition<boolean> =>
    async () =>
      !(await condition()),
};

export const protractor = {Key};
