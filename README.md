# AngularMfeHost

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


# Module Federation Config Step-by-step:

## Step 1: Create the Host Application

```bash
ng new mfe-host --routing --style=css
cd mfe-host
```

## Step 2: Create the Remote Application

```bash
ng new mfe-remote --routing --style=css
cd mfe-remote
```

## Step 3: Install Module Federation

In both projects (host and remote):

```bash
ng add @angular-architects/module-federation
```
Select Classic.

When prompted for ports:
- Host app: Choose port 4200 (default)
- Remote app: Choose port 4201

## Step 4: Configure the Remote Application

### Update `webpack.config.js` in the remote app exposing the routes,
### so the remote app is responsible to manage it:

```javascript
module.exports = withModuleFederationPlugin({
  name: '[remote app name]',
  exposes: {
    './Routes': './src/app/app.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

## Step 5: Configure the Host Application

### Update `webpack.config.js` in the host app:

```javascript
module.exports = withModuleFederationPlugin({
  remotes: {
    "[remote app name]": "http://localhost:4201/remoteEntry.js",
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### Update routing in host app (`app.routes.ts` or `app-routing.module.ts`):

```typescript
const routes: Routes = [
  {
    path: 'remote',
    loadChildren: () => import('[remote app name]/Routes').then(m => m.routes)
  },
  // other routes
];
```

### Add type definitions to prevent your IDE errors:

Create `src/module-federation.d.ts`:

```typescript
declare module 'angular-mfe-dashboard/Routes' {
  import { Routes } from '@angular/router';
  export const routes: Routes;
}
```