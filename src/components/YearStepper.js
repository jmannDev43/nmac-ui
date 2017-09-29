import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Step, StepLabel, Stepper, StepButton } from 'material-ui/Stepper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Stop from 'material-ui/svg-icons/av/stop';
import CircularProgress from 'material-ui/CircularProgress';
import { withRouter } from 'react-router-dom';
import isMaxYear from '../utils';

const collisionYears = [
  1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016, 2017,
];
let intervalId;

class YearStepper extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
    };
  }
  updateStep(year) {
    let url = this.props.match.path.replace(':year', year);
    if (url.indexOf(':state') > -1) {
      url = url
        .replace(':state', this.props.match.params.state)
        .replace(':country', this.props.match.params.country);
    }
    this.props.history.push(url);
  }
  playTimeline() {
    console.log('Starting Player');
    this.setState({ isPlaying: true });
    const currentYear = parseInt(this.props.match.params.year, 10);
    const timeInterval = this.props.match.url.indexOf('state') > -1 ? 2000 : 1000;
    let yearIndex = isMaxYear(collisionYears, currentYear) ? 0 :
      collisionYears.indexOf(currentYear);
    intervalId = setInterval(() => {
      const year = collisionYears[yearIndex];
      if (isMaxYear(collisionYears, year)) {
        this.stopTimeline();
      }
      yearIndex += 1;
      this.updateStep(year);
    }, timeInterval);
  }
  stopTimeline() {
    clearInterval(intervalId);
    console.log('Stopping Player');
    this.setState({ isPlaying: false });
  }
  render() {
    const activeYear = parseInt(this.props.activeYear, 10);
    const loadingYear = isMaxYear(collisionYears, activeYear) ? collisionYears[0] :
      (activeYear + 1);
    return (
      <div>
        <div className="yearStepperWrapper">
          <Stepper
            linear={false}
            activeStep={collisionYears.indexOf(activeYear)}
            connector={null}
          >
            {
              collisionYears.map((year, i) => (<Step key={`step_${year}`}>
                <StepButton key={`stepButton_${year}`} onClick={() => this.updateStep(year)}>
                  <StepLabel
                    style={{
                      transform: 'rotate(90deg)',
                      paddingLeft: 0,
                      paddingRight: 0,
                      width: '30px',
                      color: 'white',
                    }}
                    key={`stepLabel_${year}`}
                  >{year}</StepLabel>
                </StepButton>
              </Step>))
            }
          </Stepper>
        </div>
        {this.state.isPlaying ?
          <div className="col col-sm-2">
            <FloatingActionButton
              style={{ margin: '1em 2em 0 1em' }}
              secondary={false}
              mini
              onClick={this.stopTimeline.bind(this)}
            >
              <Stop />
            </FloatingActionButton>
            <CircularProgress size={30} />
            <h3 className="stepperYear">Loading {loadingYear}...</h3>
          </div>
          :
          <div className="col col-sm-2">
            <FloatingActionButton
              style={{ margin: '1em 2em 0 1em', boxShadow: 'rgba(90, 211, 47, 0.16) 0px 3px 10px, rgba(90, 211, 47, 0.23) 0px 3px 10px' }}
              backgroundColor="#00E676"
              mini
              onClick={this.playTimeline.bind(this)}
            >
              <PlayArrow />
            </FloatingActionButton>
          </div>
        }
      </div>
    );
  }
}

YearStepper.propTypes = {
  history: PropTypes.object,
  activeYear: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      year: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string,
    }),
    url: PropTypes.string,
    path: PropTypes.string,
  }),
};

export default withRouter(YearStepper);
