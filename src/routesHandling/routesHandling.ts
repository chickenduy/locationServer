export default class RoutesHandling {
	/**
	 * This is a basic function that returns a JSON "Hello world!"
	 * @param req 
	 * @param res 
	 */
	public handleBasicRequest = (req, res) => {
		res.set({
			'Content-Type': 'application/json'
		})
		res.status(200)
			.send({
				"Hello": "world!"
			})
	}
}
