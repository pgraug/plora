import Head from 'next/head'
import styles from '../../styles/View.module.css'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import ChartComponent from 'react-chartjs-2';
import { firestore } from '../../utils/db';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { useRouter } from 'next/router';


// plora.xyz/view/dfbidfsdfnsdlkfbhk

export default function View({data}) {
    
	console.log(data.data);

	const router = useRouter()
	const { ploraId } = router.query
	
	const [state, setState] = React.useState({
        loaded: false
    });

	React.useEffect(() => {
		setState({ ...state, loaded: true});
	}, [])

	return (
        <Container maxWidth="lg" className={styles.container}>
			
			
			{ !state.loaded ? (
                <Box className={styles.loadWrapper}>
                    <Typography variant="h4" className={styles.loadTitle}>Loader...</Typography>
                </Box>
            ) : (
                <React.Fragment>
					<Card className={styles.card}>
						<ChartComponent
							type={data.type}
							data={data.data}
							options={{
								plugins: {
									title: {
										display: true,
										text: data.title,
										font: {
											size: 24,
										},
									},
								},
								scales: {
									x: {
										title: {
											display: true,
											text: data.xLabel
										}
									},
									y: {
										title: {
											display: true,
											text: data.yLabel
										}
									},
								},
								elements: {
									point: {
										radius: 4,
										hoverRadius: 5
									}
								}
							}}
						/>
					</Card>
                    <Paper className={styles.main}>
				<Typography variant="h4">Indstillinger</Typography>
			</Paper>
                </React.Fragment>
            )}
        </Container>
	)	
}

export async function getServerSideProps(context) {
    let ploraId = context.params.ploraId
	let data = {}
	const doc = await firestore.collection("ploras").doc(ploraId).get();
	if (!doc.exists) {
	console.log('No such document!');
	} else {
	data = doc.data()
	}
	return {
		props: { data }, // will be passed to the page component as props
	}
}