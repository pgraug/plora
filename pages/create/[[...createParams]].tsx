import Head from 'next/head'
import styles from '../../styles/Create.module.css'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import React, { useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { palette, spacing, typography } from '@material-ui/system';
import TreePicker from '../../components/TreePicker';
import { GetStaticPaths } from 'next';
import { DataUsage } from '@material-ui/icons';
import TreeItem from '@material-ui/lab/TreeItem';

// plora.xyz/create/DST/DODD10

export default function Create({subjectTableData}) {
	const router = useRouter()
	const { createParams } = router.query

	const handleProviderChange = (e) => {
		router.replace({
			pathname: '/create/[providerId]',
			query: { providerId: e.target.value },
		}, undefined, {scroll: false, shallow: true})
	};
	
	return (
		<Container maxWidth="md" className={styles.container}>
			<Typography variant="h1" className={styles.title}>Lav din egen plora.</Typography>
			<Paper className={styles.main} elevation={3}>
				<Typography variant="body1">OBS: Da plora stadig er i beta, er det endnu kun muligt at indhente data fra Danmarks Statistik.</Typography>
				<Typography variant="h4">Trin 1: Vælg en dataudbyder at hente data fra.</Typography>
				<FormControl className={styles.formControl}>
					<InputLabel htmlFor="data-provider">Datakilde</InputLabel>
					<Select
						native
						value={createParams != null ? (createParams[0] + "") : ""}
						onChange={handleProviderChange}
						inputProps={{
							name: 'provider',
							id: 'data-provider',
						}}
					>
						<option aria-label="None" value="" />
						<option value={"dst"}>Danmarks Statistik</option>
					</Select>
				</FormControl>

				{	
					// Use TreeView here. Use Timeline for the roadmap on the front page.
					createParams != null
					? (
						<React.Fragment>
							<Typography variant="h4">Trin 2: Vælg den tabel du vil trække data fra</Typography>
							<TreePicker provider={createParams != null ? (createParams[0] + "") : ""}>{subjectTableData}</TreePicker>
						</React.Fragment>
					)
					: null
				}
			</Paper>
		</Container>
	)	
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export async function getStaticProps() {
    const res = await fetch("https://api.statbank.dk/v1/subjects?format=JSON&recursive=true&includeTables=true&omitSubjectsWithoutTables=true")
    const subjectTableData = await res.json()
    
    if (!subjectTableData) {
        return {
            notFound: true,
        }
    }

    return {
        props: { subjectTableData }, // will be passed to the page component as props
		revalidate: 187200,
    }
}