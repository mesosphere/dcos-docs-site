# SCSS

## Code Style

Be consistent with code style.

- 2 space indentation.

- Space before first bracket and keep ending brackets on their own line.

- Every attribute on own line.

## Mobile First

We will be using mobile first approach to our styling

[Mobile First SCSS](https://zellwk.com/blog/how-to-write-mobile-first-css/)

## BEM

All SCSS must be written using BEM naming convention

[BEM](https://seesparkbox.com/foundry/bem_by_example)

## Media Queries

Media queries are preset in `scss/variables/_breakpoints.scss`

When using media query mixins, include each desired breakpoint only once per file.

Do this

```scss
.content {
  // ...
  &__container {
    // ...
  }
  &__wrapper {
    // ...
  }
  @include md {
    // ...
    &__container {
      // ...
    }
    &__wrapper {
      // ...
    }
  }
  @include lg {
    // ...
    &__container {
      // ...
    }
    &__wrapper {
      // ...
    }
  }
}

```

Don't do this

```scss
.content {
  // ...
  &__container {
    // ...
    @include md {
      // ..
    }
    @include lg {
      // ..
    }
  }
  &__wrapper {
    // ...
    @include md {
      // ..
    }
    @include lg {
      // ..
    }
  }
}

```
