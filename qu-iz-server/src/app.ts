import Controller from '@classes/controller.class';
import ExceptionFilter from '@filters/exception.filter';
import EventEmitter from 'events';
import express, { Application } from 'express';

declare interface App {
  on(event: 'load', listener: () => void): this;
  on(event: 'start', listener: (port: number) => void): this;
}

class App extends EventEmitter {
  private loaded: boolean = false;
  private readonly port: number;
  private readonly application: Application = express();

  constructor(port: number) {
    super();
    this.port = port;
  }

  private loadControllers(controllers: Controller[]): void {
    for (const controller of controllers) {
      this.application.use(controller.path, controller.router);
    }
  }

  private loadFilters(): void {
    ExceptionFilter.use(this.application);
  }

  public load(controllers: Controller[]): void {
    this.loadControllers(controllers);
    this.loadFilters();
    this.loaded = true;
    this.emit('load');
  }

  public start(): void {
    if (!this.loaded) {
      throw new Error('Application tried to start before loading');
    }

    this.application.listen(this.port);
    this.emit('start', this.port);
  }
}

export default App;
