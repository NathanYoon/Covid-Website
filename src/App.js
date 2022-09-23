import React, { useEffect, useMemo } from 'react';
import { sortBy } from 'lodash';
import CountrySelector from './components/CountrySelector';
import { getCountries, getReportByCountry } from './components/apis';
import Summary from './components/Summary';
import Highlight from './components/Highlight';
import { Container, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import '@fontsource/roboto';
import moment from 'moment';
import 'moment/locale/en-ca';

moment.locale('en-ca');

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();
  const [countries, setCountries] = React.useState([]);
  const [selectedCountryId, setSelectedCountryId] = React.useState('');
  const [report, setReport] = React.useState([]);

  useEffect(() => {
    getCountries().then((res) => {
      const { data } = res;
      const countries = sortBy(data, 'Country');
      setCountries(countries);
      setSelectedCountryId('af');
    });
  }, []);

  const handleOnChange = React.useCallback((e) => {
    setSelectedCountryId(e.target.value);
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      const selectedCountry = countries.find(
        (country) => country.ISO2 === selectedCountryId.toUpperCase()
      );
      getReportByCountry(selectedCountry.Slug).then((res) => {
        console.log('getReportByCountry', { res });
        // remove last item = current date
        res.data.pop();
        setReport(res.data);
      });
    }
  }, [selectedCountryId, countries]);

  const summary = useMemo(() => {
    if (report && report.length) {
      const latestData = report[report.length - 1];
      return [
        {
          title: 'Infected',
          count: latestData.Confirmed,
          type: 'confirmed',
        },
        {
          title: 'Recovered',
          count: latestData.Recovered,
          type: 'recovered',
        },
        {
          title: 'Deaths',
          count: latestData.Deaths,
          type: 'death',
        },
      ];
    }
    return [];
  }, [report]);

  return (
    

    <Container>
      <AppBar position='fixed' top='0'>
        <Toolbar>
          <Typography variant='h6' className={classes.title} style={{'fontSize': 1.5 + 'em'}}>
            Covid Dashboard
          </Typography>
          <Button color='inherit' href="https://covidmap-team2de.netlify.app/" style={{'marginRight': 15 +'px'}}>
            Global Map & Stat
          </Button>
          <Button color='inherit' href="https://www.vaccines.gov/search/" target="_blank">
            Get Vaccine
          </Button>
        </Toolbar>
      </AppBar>
      <Typography variant='h4' component='h4' align='center' style={{'margin': 100 + 'px'}}>
      Country Wise Cases of COVID-19
      </Typography>

      <Typography>{moment().format('LLLL')}</Typography>
      <CountrySelector
        handleOnChange={handleOnChange}
        countries={countries}
        value={selectedCountryId}
      />

      <Highlight summary={summary} />

      <Summary countryId={selectedCountryId} report={report} />

      <Typography align='center'>
        <Link align='center' href="https://documenter.getpostman.com/view/10808728/SzS8rjbc" target="_blank">
          Source: Coronavirus COVID19 API
        </Link>
      </Typography>
  
    </Container>
  );
};

export default App;
