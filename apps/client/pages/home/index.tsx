import Head from 'next/head';
import {
  Container, Typography, Box, Grid, Paper, Button,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Link from 'next/link';
import useTranslation from '../../hooks/useTranslation';
import { SIGN_IN, SIGN_UP } from '../../utils/routes';

export default function Home() {
  const { trans } = useTranslation();

  return (
    <>
      <Head>
        <title>{trans('Home')}</title>
      </Head>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Container maxWidth="md" sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h4" gutterBottom>
              Welkom bij Nexxus Stock Keeping
            </Typography>
            <Typography paragraph>
              Organiseer inkooporders, verkooporders en voorraad. Volg klanten, leveranciers en partners.
            </Typography>
            <Typography paragraph>
              Logistieke planning, distributie en live volgen van uw wagenpark. Gebruik bestaande barcodes
              of laat Nexxus deze voor u maken. Maak verbinding met en integreer elke applicatie op basis van API.
            </Typography>
            <Typography paragraph>
              Intuïtieve gebruikersinterface met strak ontwerp. Elk klein bedrijf en elke onderneming kan de
              basis van deze software gratis gebruiken.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Aanvullende modules
            </Typography>
            <Typography paragraph>
              Beschikbaar voor laaggeprijsde maandabonnementen die per maand opzegbaar zijn. Modules kosten €5 tot €20 euro per maand.
            </Typography>

            <Typography paragraph>
              Waarom zou u uw bedrijfsmodel en workflows veranderen om propriëtaire software te gebruiken?
              Pas Nexxus eenvoudig aan uw bedrijfsmodel en workflows aan. Het maakt niet uit wat voor bedrijf je hebt.
              Bouw, detailhandel, makelaar, transport etc. Als u een of meer van de onderstaande zaken heeft.
            </Typography>

            {/* Additional MUI Components */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Contactgegevens
                  </Typography>
                  <Typography>
                    Handelsnaam: Mardten de Bakker
                  </Typography>
                  <Typography>
                    KVK-nummer: 84893184
                  </Typography>
                  <Typography>
                    Bezoekadres: Laan van Ypenburg 132, 2497 GC Den Haag
                  </Typography>
                  <Typography>
                    M: 0627394143
                  </Typography>
                  <Typography>
                    Email:
                    <Link href="mailto:mardten.debakker@copiatek.nl" style={{ textDecoration: 'none', color: 'inherit' }} passHref>mardten.debakker@copiatek.nl</Link>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Transactie informatie
                  </Typography>
                  <Typography>
                    Betaling in Euro
                  </Typography>
                  <Typography>
                    Betalingsvoorwaarden: opzegtermijn per maand
                  </Typography>
                  <Typography>
                    <Link href="https://e-justice.europa.eu/directivePartsTableOfContents.do?idTaxonomy=603&fromParentPage=yes" target="_blank" rel="noopener noreferrer">
                      Meer informatie over betalingsvoorwaarden
                    </Link>
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Link href="https://github.com/mardtendebakker/nsk/wiki" target="_blank" rel="noopener noreferrer">
                Onze wikipagina en code bekijken
              </Link>
            </Box>
            <Grid container spacing={2} mt={3}>
              <Grid item xs={6}>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Link href={SIGN_IN} passHref>
                    <Button sx={{ width: '100%', margin: '0 4px' }} color="primary" variant="contained">
                      <LoginIcon style={{ marginRight: '8px' }} />
                      <Typography>{trans('signIn')}</Typography>
                    </Button>
                  </Link>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Link href={SIGN_UP} passHref>
                    <Button sx={{ width: '100%', margin: '0 4px' }} color="primary" variant="contained">
                      <PersonAddIcon style={{ marginRight: '8px' }} />
                      <Typography>{trans('signUp')}</Typography>
                    </Button>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
