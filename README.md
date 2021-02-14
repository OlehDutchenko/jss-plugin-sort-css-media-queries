# jss-plugin-sort-css-media-queries

JSS plugin for sort CSS media queries

## Install

```bash
npm i jss-plugin-sort-css-media-queries
```

## Usage

Simple use plugin

```ts
import jss from 'jss';
import sortCssMediaQueries from 'jss-plugin-sort-css-media-queries';

jss.use(sortCssMediaQueries(/* pluginOptions */));
```

Or create an own JSS instance

```ts
import { create } from 'jss';
import sortCssMediaQueries from 'jss-plugin-sort-css-media-queries';

const jss = create({
    plugins: [sortCssMediaQueries(/* pluginOptions */)]
});
```

## Plugin options

### `desktopFirst`

type: `boolean`  
default: `false`

By default, plugin is using _mobileFirst_ methodology for sorting CSS Media Queries.  
By this option you can change behavior to the _desktopFirst_ methodology.

### `combineMediaQueries`

type: `boolean`  
default: `false`

You can combine similar CSS Media Queries rules into the one block.

```ts
import jss from 'jss';
jss.use(sortCssMediaQueries());

const sheet = jss.createStyleSheet({
    button: {
        width: 100,
        '@media (min-width: 600px)': {
            width: 150
        }
    },
    span: {
        color: 'blue',
        '@media (min-width: 600px)': {
            width: 'yellow'
        }
    }
});
```

Result without `combineMediaQueries`

```css
button {
    width: 100px;
}

span {
    color: blue;
}

@media (min-width: 600px) {
    button {
        width: 150px;
    }
}

@media (min-width: 600px) {
    span {
        color: yellow;
    }
}
```

Result with `combineMediaQueries: true`

```css
button {
    width: 100px;
}

span {
    color: blue;
}

@media (min-width: 600px) {
    button {
        width: 150px;
    }

    span {
        color: yellow;
    }
}
```

## How it works

> Unfortunately, I have not found a more correct method of influencing the sorting of the list of rules than how to modify the `RuleList::toString()` method.  
> That is a wrong way from the architecture OOP principles, but it is the most non-breaking way for the whole JSS workflow.  
> After calling `.toString()` method JSS work is done and in this point I can make own job with sorting, combining and returning CSS output.

---

## Contributing

Please fill free to create [issues](https://github.com/dutchenkoOleg/jss-plugin-sort-css-media-queries/issues) or send [PR](https://github.com/dutchenkoOleg/jss-plugin-sort-css-media-queries/pulls)

## Licence

[BSD-3-Clause License](https://github.com/dutchenkoOleg/jss-plugin-sort-css-media-queries/blob/master/LICENSE)

---
