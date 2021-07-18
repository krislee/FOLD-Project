# React TodoMVC 
A search feature is added on to the TODO application. To search, simply type anything you want in the `input` search bar and click Submit. When Submit is clicked, the application filters out todos that contains the words you type and returns the filtered todos under the url path `"#/search"`. 

To implement the search feature:

- The `searchTodo` state is set to the `input` search bar value during `onChange` in `handleSearchChange` function.
- When Submit is clicked, the `nowShowing` state is set to `app.SEARCH_TODOS` in the `Router()`.
- When `nowShowing` state is `app.SEARCH_TODOS` the `searchTodo` state is used in the `includes` function inside the switch statement. The `includes` function is called on each `todo`.

To ensure the search results remain the same when search `input` value changes until Submit is clicked:

- When Submit is clicked, the `previousSearch` state is set to the same value as `searchTodo` state.
- When the `input` search value changes, rendering is not affected. This is because when the `input` search value changes, the `input`'s search bar `onKeyDown` event happens. During the `onKeyDown` event, `handleSearchKeyDown` function sets the `nowShowing` state to `app.PREVIOUS_SEARCH_TODOS`. When `nowShowing` state is `app.PREVIOUS_SEARCH_TODOS` the `previouSearch` state is used in the `includes` function inside the switch statement. Since the `previousSearch` state was equal to `searchTodo` state, rendering shows the same results from the first time Submit is clicked even though the current `searchTodo` state changes when `input` value changes.

To change the URL to `"#/search"` when searching:
- When Submit is clicked, `a` tag's `href` attribute is equal to `"#/search"`.
- When URL path is `"#/search"`, `nowShowing` state is set to `app.SEARCH_TODOS` in the `Router()`.

# Installation
Run `npm i`.

# Run App Locally
To run the app locally, run `python -m SimpleHTTPServer`.

# Improvements
- When page with URL path `"#/search"` is refreshed, the URL should be redirected to homepage `"#/"`.
- When search is submitted, append the search value to the URL path. 
- When page with URL path `"#/search/search_value"` is refreshed, the search results are re-rendered.

