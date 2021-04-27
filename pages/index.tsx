import { Container } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
	return (
		<Container maxWidth="md" className={styles.container}>
			<Head>
				<title>plora.</title>
			</Head>
			<Typography variant="h1" className={styles.title}>Lær plora at kende.</Typography>
			<Card className={styles.card}>
				<CardActionArea>
					<CardMedia
						className={styles.media}
						component="img"
						alt="Regional middellevealder (år)"
						width="100%"
						image="https://storage.googleapis.com/plora-xyz.appspot.com/SWvdlBbC6Ou22sOpD8H9"
						title="Regional middellevealder (år)"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							1) Se hvordan udgivne grafer ser ud.
						</Typography>
						<Typography variant="body2" component="p">
							Gennem eksemplet "Regional middellevealder (år)" ser vi hvordan det endelige resultat fremstilles. Klik nedenfor for at gå til siden.
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions>
					<Link
						href={"/view/SWvdlBbC6Ou22sOpD8H9"}
						passHref
					>
						<Button size="small" color="secondary">
							Klik her for at se eksemplet
						</Button>
					</Link>
				</CardActions>
			</Card>
			<Card className={styles.card}>
				<CardActionArea>
					<CardMedia
						className={styles.media}
						component="img"
						alt="Arbejdsmarkedstilknytning (procent)"
						width="100%"
						image="https://storage.googleapis.com/plora-xyz.appspot.com/MVPZuznIX3N990FstTXY"
						title="Arbejdsmarkedstilknytning (procent)"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							2) Lav din egen graf ud fra tabellen "Arbejdsmarkedstilknytning (procent)"
						</Typography>
						<Typography variant="body2" component="p">
							Nu skal du lave din første plora. Læs følgende trin og klik så på linket nedenfor:<br />
							1) Vælg "Linjediagram"<br />
							2) Under "Vælg data til x-aksen" vælger du variablen "Tid"  og sætter hak i årene 2009-2018.<br />
							3) Under "Vælg data til y-aksen" vælger du så variablen "Beskæftigelsesstatus" og værdien "Beskæftigelsesfrekvens"<br />
							4) Ved yderligere variabler vælger du "Alder" og sætter hak i de fem aldersintervaller.<br />
							5) Tryk på HENT DATA og rul op i toppen af skærmen for at se din graf.<br />
							6) Hvis du har lyst, kan du ændre titlen nu eller vælge andre data (husk at trykke HENT DATA bagefter for at opdatere grafen)<br />
							7) Til sidst, trykker du på UDGIV for at udgive din allerførste plora. Du videresendes automatisk til dens side.
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions>
					<Link
						href={"finalize/dst-aku121"}
						passHref
					>
						<Button size="small" color="secondary">
							Klik her når du har læst guiden
						</Button>
					</Link>
				</CardActions>
			</Card>
			<Card className={styles.card}>
				<CardActionArea>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							3) Fri leg: Vælg selv en tabel at tage data fra
						</Typography>
						<Typography variant="body2" component="p">
							Du er nu klar til at lave en plora helt fra bunden. Tabellerne er inddelt i kategorier og underkategorier. Vælg en tabel ved at trykke på den og tryk så på knappen BENYT DENNE TABEL, der popper op i bunden af skærmen.
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions>
					<Link
						href={"/create"}
						passHref
					>
						<Button size="small" color="secondary">
							Klik her for at se tabellerne.
						</Button>
					</Link>
				</CardActions>
			</Card>
		</Container>
	)
}
