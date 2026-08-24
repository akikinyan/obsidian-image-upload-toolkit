// Empty declaration to allow for css imports
declare module "*.css" {}

// proxy-from-env v2 ships no type definitions.
declare module "proxy-from-env" {
  /**
   * Returns the proxy URL to use for the given target URL, honouring the
   * HTTP_PROXY / HTTPS_PROXY / ALL_PROXY / NO_PROXY environment variables
   * (both upper and lower case). Returns an empty string when no proxy applies.
   */
  export function getProxyForUrl(url: string): string;
}
