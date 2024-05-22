import config from '../docusaurus.config';


describe('Docusaurus Config', () => {
  it('should have a valid title', () => {
    expect(config.title).toBe('Nexxus');
  });

  it('should have a valid tagline', () => {
    expect(config.tagline).toBe('Documentation of nexxus');
  });
  it('should have a valid favicon', () => {
    expect(config.favicon).toBe('img/favicon.ico');
  });

  it('should have a valid baseUrl', () => {
    expect(config.baseUrl).toBe('/');
  });

  it('should have the correct organization name', () => {
    expect(config.organizationName).toBe('facebook');
  });

  it('should have the correct project name', () => {
    expect(config.projectName).toBe('docusaurus');
  });

  it('should have the correct defaultLocale', () => {
    expect(config.i18n.defaultLocale).toBe('en');
  });

  it('should have the correct locales', () => {
    expect(config.i18n.locales).toContain('en');
  });
 
});

