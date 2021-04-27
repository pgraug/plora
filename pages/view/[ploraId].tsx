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
import { type } from 'node:os';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Link from 'next/link';


// plora.xyz/view/dfbidfsdfnsdlkfbhk

export default function View({data}) {
    
	console.log(data);

	const router = useRouter()
	const { ploraId } = router.query
	
	const [state, setState] = React.useState({
        loaded: false,
		copied: false
    });

	const copyToClipboard = str => {
		const el = document.createElement('textarea');
		el.value = str;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		setState({ ...state, copied: true})
	};

	const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		setState({ ...state, copied: false})
	};

	React.useEffect(() => {
		setState({ ...state, loaded: true});
	}, [])

	return (
        <Container maxWidth="lg" className={styles.container}>
			
			
			{ !state.loaded ? (
                <Box className={styles.loadWrapper}>
                    <Typography variant="h4" className={styles.loadTitle}>Loader...</Typography>
					<Head>
						<title>plora.</title>
					</Head>
                </Box>
            ) : (
                <React.Fragment>
					<Head>
						<title>{data.title + " | plora."}</title>
					</Head>
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
						<Typography variant="body2" color="textSecondary">Kilde: Danmarks Statistik ({data.tableId}) via plora.</Typography>
					</Card>
					<Card className={styles.main}>
						<CardActionArea>
							<CardContent>
								<Typography gutterBottom variant="h5" component="h2">
									Del "{data.title}" eller lav din egen plora.
								</Typography>
								<Typography variant="body2" component="p">
									Plora gør tung statistik overskueligt. Del denne plora med andre eller prøv selv at lave en.
								</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<Button size="small" color="secondary" onClick={() => copyToClipboard("https://plora.xyz/view/" + ploraId)}>
								Kopier link
							</Button>
							<Link
								href={"/finalize/" + data.providerId + "-" + data.tableId}
								passHref>
								<Button size="small" color="secondary">
									Ny fra denne tabel
								</Button>
							</Link>
							<Link
								href={"/create"}
								passHref>
								<Button size="small" color="secondary">
									Begynd fra bunden
								</Button>
							</Link>
						</CardActions>
					</Card>
					<Snackbar open={state.copied} autoHideDuration={3000} onClose={handleClose}>
						<Alert variant="filled" onClose={handleClose} severity="success">
							Linket blev kopieret til udklipsholderen
						</Alert>
					</Snackbar>
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