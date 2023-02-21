import EventEmitter from './eventEmitter';

describe('EventEmitter', () => {
  const emitter = new EventEmitter();

  describe('on', () => {
    it('adds a new listener for the given event', () => {
      const listener = jest.fn();
      emitter.on('myEvent', listener);
      expect(emitter.events.myEvent).toContain(listener);
    });

    it('appends multiple listeners for the same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      emitter.on('myEvent', listener1);
      emitter.on('myEvent', listener2);
      expect(emitter.events.myEvent).toContain(listener1);
      expect(emitter.events.myEvent).toContain(listener2);
    });
  });

  describe('emit', () => {
    it('calls all registered listeners for the given event with the given payload', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      emitter.on('myEvent', listener1);
      emitter.on('myEvent', listener2);
      const payload = { data: 'abc' };
      emitter.emit('myEvent', payload);
      expect(listener1).toHaveBeenCalledWith(payload);
      expect(listener2).toHaveBeenCalledWith(payload);
    });

    it('does not throw if there are no listeners for the given event', () => {
      expect(() => emitter.emit('myEvent', { data: 'abc' })).not.toThrow();
    });
  });

  describe('removeListener', () => {
    it('removes a previously registered listener for the given event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      emitter.on('myEvent', listener1);
      emitter.on('myEvent', listener2);
      emitter.removeListener('myEvent', listener1);
      expect(emitter.events.myEvent).not.toContain(listener1);
      expect(emitter.events.myEvent).toContain(listener2);
    });

    it('does not throw if the given listener was not registered for the given event', () => {
      const listener = jest.fn();
      expect(() => emitter.removeListener('myEvent', listener)).not.toThrow();
    });
  });
});
