- [Red Hat Marketplace Widgets](#red-hat-marketplace-widgets)
  - [Using](#using)
  - [Recommended services](#recommended-services)

# Red Hat Marketplace Widgets

## Using

To display widgets, you have to:

1. Disable CORS policy in your browser (you can use [Chrome extension](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en).)

2. Provide your API key in localStorage as `marketplace-key`:

```jsx
localStorage.setItem('marketplace-key', YOUR_KEY)
```

3. Refresh page

## Recommended services

This widget shows a list of recommended services with a modal to browse the catalog.

```jsx
<RecommendedServices />
```