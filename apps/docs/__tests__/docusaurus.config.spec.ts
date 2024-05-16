import config from '../docusaurus.config';

describe('Docusaurus Config', () => {
  it('should have a valid title', () => {
    expect(config.title).toBe('Nexxus');
  });
});