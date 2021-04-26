import {firestore, bucket} from '../../utils/db';
import ChartJSImage from "chartjs-to-image"

export default async (req, res) => {
	try {
		let chart = new ChartJSImage();
		chart.setConfig({
			type: req.body.type,
			data: req.body.data,
			options: {
				plugins: {
					title: {
						display: true,
						text: req.body.title,
						font: {
							size: 24,
						},
					},
				},
				scales: {
					x: {
						title: {
							display: true,
							text: req.body.xLabel
						}
					},
					y: {
						title: {
							display: true,
							text: req.body.yLabel
						}
					},
				},
				elements: {
					point: {
						radius: 4
					}
				}
			}
		})
		chart.setWidth(1200)
		chart.setHeight(600)
		const bin = await chart.toBinary()

		const { id } = await firestore.collection('ploras').add({
			...req.body,
			imageURL: ""
		});
		let file = bucket.file(id)
		let image = await file.save(bin, {contentType: "image/png"})
		file.makePublic(function(err, apiResponse) {});
		firestore.collection('ploras').doc(id).set({
			imageURL: file.publicUrl()
		  }, { merge: true });
		//console.log(req.body);
		res.status(200).json({ id });
	} catch (e) {
		res.status(400).end();
	}
}