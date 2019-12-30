export let startAggregation = (req, res, groups: any[][]) => {
    switch (req.body.type) {
        case "test":
            sendAggregation1()
            res.status(200).send("startAggregation")
            break
        case "test2":
            sendAggregation1()
            break
        default:
            break
    }
}

let sendAggregation1 = () => {

}