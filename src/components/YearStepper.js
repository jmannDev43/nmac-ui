import React, { Component } from 'react';
import { Step, StepLabel, Stepper, StepButton } from 'material-ui/Stepper';

const collisionYears = [1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

class YearStepper extends Component {
  updateStep(stepIndex) {
    this.props.updateMapData(null);
    this.props.updateActiveYear(collisionYears[stepIndex - 1]);
  }
  render() {
    return (
      <div style={{width: '100%', maxWidth: (window.innerWidth), overflowX: 'scroll', height: '102px', border: '1px solid grey' }}>
        <Stepper linear={false} activeStep={collisionYears.indexOf(this.props.activeYear)} connector={null}>
          {
            collisionYears.map((year, i) => {
              return <Step key={`step_${year}`}>
                <StepButton key={`stepButton_${year}`} onClick={() => this.updateStep(i)}>
                  <StepLabel style={{transform: 'rotate(90deg)', paddingLeft: 0, paddingRight: 0, width: '30px', color: 'white' }} key={`stepLabel_${year}`}>{year}</StepLabel>
                </StepButton>
              </Step>
            })
          }
        </Stepper>
      </div>
    )
  }
}

export default YearStepper;
