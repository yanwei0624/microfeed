export const SETTINGS_CONTROLS = {
  SUBSCRIBE_METHODS: 'subscribe_methods',
  ITEMS_SORT_ORDER: 'items_sort_order',
};

export const CONTROLS_TEXTS_DICT = {
  [SETTINGS_CONTROLS.SUBSCRIBE_METHODS]: {
    linkName: '订阅方式',
    modalTitle: '订阅方式',
    text: "您的受众如何订阅您的订阅源？例如：JSON、RSS、Apple Podcasts、Spotify...",
    rss: null,
    json: '{ "_microfeed": { "subscribe_methods": [{"name": "RSS", "type": "rss", "url": "https://www.microfeed.org/rss/"}] } }',
  },
  [SETTINGS_CONTROLS.ITEMS_SORT_ORDER]: {
    linkName: '排序方式',
    modalTitle: '项目排序方式',
    text: "订阅源中项目的排序方式：最新在前，还是最早在前？",
    rss: null,
    json: '{ "_microfeed": { "items_sort_order": "newest_first" }',
  },
};
