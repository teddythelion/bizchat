export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.7f0461e6.js","imports":["_app/immutable/entry/start.7f0461e6.js","_app/immutable/chunks/index.eca2681d.js","_app/immutable/chunks/singletons.13a7ce04.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.c0444cd5.js","imports":["_app/immutable/entry/app.c0444cd5.js","_app/immutable/chunks/index.eca2681d.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js')
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
