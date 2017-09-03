function ManifestPlugin() {
  // this plugin has no options and is specific to the server side rendering implementation
}

ManifestPlugin.prototype.apply = function(compiler) {
  compiler.plugin("emit", (compilation, compileCallback) => {
    const {
      assetsByChunkName,
      assets,
      entrypoints
    } = compilation.getStats().toJson({ entrypoints: true });

    const manifestJson = JSON.stringify(
      { assetsByChunkName, assets, entrypoints },
      null,
      2
    );

    compilation.assets["manifest.json"] = {
      source: function() {
        return manifestJson;
      },
      size: function() {
        return manifestJson.length;
      }
    };

    compileCallback();
  });
};

module.exports = ManifestPlugin;
