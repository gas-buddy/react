CHANGELOG
=========

7.0.0
-----
* Removed all traces of redux
* Remove prop-types on the way to preferring TypeScript
* Remove WithData in favor of simpler unstated containers
* Provide unstated IsomorphicContainer that hydrates from window.PreloadedState. On the server side, this expects that the values in initialState are actual containers, not JSON.
* Provide UnstatedProvider that can be put in the render hierarchy to enable IsomorphicContainers