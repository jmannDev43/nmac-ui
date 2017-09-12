import React, { Component } from 'react';
import { Step, StepLabel, Stepper, StepButton } from 'material-ui/Stepper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Stop from 'material-ui/svg-icons/av/stop';
import CircularProgress from 'material-ui/CircularProgress';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

const collisionYears = [1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
let intervalId;

class YearStepper extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
    }
  }
  updateStep(year) {
    let url = this.props.match.path.replace(':year', year);
    if (url.indexOf(':state') > -1) {
      url = url.replace(':state', this.props.match.params.state);
    }
    this.props.history.push(url);
  }
  playTimeline() {
    console.log('Starting Player');
    this.setState({ isPlaying: true });
    let yearIndex = 0;
    intervalId = setInterval(() => {
      const year = collisionYears[yearIndex];
      if (year === collisionYears[collisionYears.length - 1]) {
        this.stopTimeline();
      }
      yearIndex++;
      this.updateStep(year);
    }, 1000);
  }
  stopTimeline() {
    clearInterval(intervalId);
    console.log(`Stopping Player`);
    this.setState({ isPlaying: false });
  }
  render() {
    console.log('this.props', this.props);
    return (
      <div>
        <div style={{
          width: '100%',
          maxWidth: (window.innerWidth),
          overflowX: 'scroll',
          height: '102px',
          border: '1px solid grey'
        }}>
          <Stepper linear={false} activeStep={collisionYears.indexOf(parseInt(this.props.activeYear))} connector={null}>
            {
              collisionYears.map((year, i) => {
                return <Step key={`step_${year}`}>
                  <StepButton key={`stepButton_${year}`} onClick={() => this.updateStep(year)}>
                    <StepLabel style={{
                      transform: 'rotate(90deg)',
                      paddingLeft: 0,
                      paddingRight: 0,
                      width: '30px',
                      color: 'white'
                    }} key={`stepLabel_${year}`}>{year}</StepLabel>
                  </StepButton>
                </Step>
              })
            }
          </Stepper>
        </div>
        {this.state.isPlaying ?
          <div className="col col-sm-1">
            <FloatingActionButton style={{margin: '1em'}} secondary={false} mini={true}
                                  onClick={this.stopTimeline.bind(this)}>
              <Stop/>
            </FloatingActionButton>
            <CircularProgress size={30} />
          </div>
            :
          <div className="col col-sm-1">
            <FloatingActionButton style={{margin: '1em', boxShadow: 'rgba(90, 211, 47, 0.16) 0px 3px 10px, rgba(90, 211, 47, 0.23) 0px 3px 10px'}} backgroundColor="#00E676" mini={true}
                                  onClick={this.playTimeline.bind(this)}>
              <PlayArrow/>
            </FloatingActionButton>
          </div>
        }
        <h2 className="stepperYear">{this.props.activeYear}</h2>
      </div>
    )
  }
}

export default withRouter(YearStepper);
