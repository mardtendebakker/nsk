class EventEmitter {
  events: { [key: string]: Listener[] };

  constructor() {
    this.events = {};
    this.on = this.on.bind(this);
    this.emit = this.emit.bind(this);
    this.removeListener = this.removeListener.bind(this);
  }

  on(event: string, listener: Listener) {
    this.events[event] = [
      ...Array.isArray(this.events[event]) ? this.events[event] : [],
      listener,
    ];
  }

  emit(event: string, payload: any) {
    const listeners = this.events[event].slice();
    listeners.forEach((listener: Listener) => listener(payload));
  }

  removeListener(event: string, listener: Listener) {
    const idx = this.events[event].indexOf(listener);

    if (idx > -1) {
      this.events[event].splice(idx, 1);
    }
  }
}

type Listener = (payload: any) => void;

export default EventEmitter;
