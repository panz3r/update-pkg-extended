/**
 * TypeScript declarations for update-pkg-extended
 */

/**
 * Options for creating a new Pkg instance
 */
export interface PkgOptions {
  /** Whether to create a new package.json if it doesn't exist */
  create?: boolean;
}

/**
 * Represents a version segment that can be retrieved
 */
export type VersionSegment = 'major' | 'minor' | 'patch' | 'prerelease';

/**
 * Package.json data structure
 */
export interface PackageData {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  type?: 'module' | 'commonjs';
  exports?: string | Record<string, unknown>;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  keywords?: string[];
  author?: string | {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: string;
  repository?: string | {
    type?: string;
    url?: string;
  };
  bugs?: string | {
    url?: string;
    email?: string;
  };
  homepage?: string;
  files?: string[];
  engines?: Record<string, string>;
  packageManager?: string;
  [key: string]: unknown;
}

/**
 * Version class interface
 */
export interface IVersion {
  /** The underlying package data */
  data: PackageData;

  /**
   * Get version or version segment
   * @param segment - The version segment to get (optional)
   * @returns The version string or segment value
   */
  get(segment?: VersionSegment): string | null;

  /**
   * Increment major version and reset minor/patch to 0
   * @returns The Version instance for chaining
   */
  newMajor(): IVersion;

  /**
   * Increment minor version and reset patch to 0
   * @returns The Version instance for chaining
   */
  newMinor(): IVersion;

  /**
   * Increment patch version
   * @returns The Version instance for chaining
   */
  newPatch(): IVersion;

  /**
   * Set or increment major version
   * @param major - The major version number (optional)
   * @returns The Version instance for chaining
   */
  major(major?: number): IVersion;

  /**
   * Set or increment minor version
   * @param minor - The minor version number (optional)
   * @returns The Version instance for chaining
   */
  minor(minor?: number): IVersion;

  /**
   * Set or increment patch version
   * @param patch - The patch version number (optional)
   * @returns The Version instance for chaining
   */
  patch(patch?: number): IVersion;

  /**
   * Set prerelease version
   * @param preleaseIdentifier - The prerelease identifier (e.g., 'alpha', 'beta', 'rc')
   * @param preleaseVersion - The prerelease version number (optional)
   * @returns The Version instance for chaining
   */
  prerelease(preleaseIdentifier: string, preleaseVersion?: number): IVersion;
}

/**
 * Package class interface
 */
export interface IPkg {
  /** The package.json file path */
  path: string;
  
  /** The version instance for version manipulation */
  version: IVersion;

  /** Configuration options */
  options: PkgOptions;

  /**
   * Set a property in package.json
   * @param prop - The property path (supports dot notation)
   * @param value - The value to set
   * @returns The Pkg instance for chaining
   */
  set(prop: string, value: unknown): IPkg;

  /**
   * Get a property from package.json
   * @param prop - The property path (supports dot notation)
   * @param defaultValue - Default value if property doesn't exist
   * @returns The property value
   */
  get(prop: string, defaultValue?: unknown): unknown;

  /**
   * Update a property using a function
   * @param prop - The property path (supports dot notation)
   * @param fn - Function that receives current value and returns new value
   * @returns The Pkg instance for chaining
   */
  update(prop: string, fn: (currentValue: unknown) => unknown): IPkg;

  /**
   * Append value to an array property
   * @param prop - The property path (supports dot notation)
   * @param value - The value to append
   * @returns The Pkg instance for chaining
   */
  append(prop: string, value: unknown): IPkg;

  /**
   * Prepend value to an array property
   * @param prop - The property path (supports dot notation)
   * @param value - The value to prepend
   * @returns The Pkg instance for chaining
   */
  prepend(prop: string, value: unknown): IPkg;

  /**
   * Delete a property from package.json
   * @param prop - The property path (supports dot notation)
   * @returns The Pkg instance for chaining
   */
  del(prop: string): IPkg;

  /**
   * Check if a property exists in package.json
   * @param prop - The property path (supports dot notation)
   * @returns True if property exists
   */
  has(prop: string): boolean;

  /**
   * Save changes to package.json asynchronously
   * @returns Promise that resolves when save is complete
   */
  save(): Promise<void>;

  /**
   * Save changes to package.json synchronously
   * @returns The Pkg instance for chaining
   */
  saveSync(): IPkg;
}

/**
 * Version manipulation class
 */
declare class Version implements IVersion {
  data: PackageData;

  constructor(sourceData?: PackageData);

  get(segment?: VersionSegment): string | null;
  newMajor(): Version;
  newMinor(): Version;
  newPatch(): Version;
  major(major?: number): Version;
  minor(minor?: number): Version;
  patch(patch?: number): Version;
  prerelease(preleaseIdentifier: string, preleaseVersion?: number): Version;
}

/**
 * Package manipulation class
 */
declare class Pkg implements IPkg {
  path: string;
  version: Version;
  options: PkgOptions;

  constructor(cwd?: string, options?: PkgOptions);

  set(prop: string, value: unknown): Pkg;
  get(prop: string, defaultValue?: unknown): unknown;
  update(prop: string, fn: (currentValue: unknown) => unknown): Pkg;
  append(prop: string, value: unknown): Pkg;
  prepend(prop: string, value: unknown): Pkg;
  del(prop: string): Pkg;
  has(prop: string): boolean;
  save(): Promise<void>;
  saveSync(): Pkg;
}

// Default export
declare const _default: typeof Pkg;
export default _default;

// Export Version class as named export
export { Version };