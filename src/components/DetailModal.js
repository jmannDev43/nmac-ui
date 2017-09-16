import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import AirPlaneModeActive from 'material-ui/svg-icons/device/airplanemode-active';

const DetailModal = (props) => {
  const customContentStyle = {
    width: '100%',
    maxWidth: 'none',
  };
  const actions = [
    <FlatButton
      label="Cancel"
      primary
      onClick={props.handleClose}
    />,
  ];
  const planeStyles = {
    flyRight: { transform: 'rotate(45deg)' },
    flyLeft: { transform: 'rotate(-45deg)' },
  };

  if (!props.modalEventData) {
    return (<div style={{ height: (window.innerHeight - 30), textAlign: 'center' }}>
      <CircularProgress size={300} thickness={7} style={{ marginTop: '18em' }} />
    </div>);
  }

  return (
    <div id="detailModalWrapper">
      <Dialog
        modal={false}
        title={props.title}
        open={props.open}
        actions={actions}
        contentStyle={customContentStyle}
        onRequestClose={props.handleClose}
        autoScrollBodyContent
      >
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn colSpan="4" />
              <TableHeaderColumn colSpan="3" tooltip="Operator 1" style={{ textAlign: 'center' }}>
                <AirPlaneModeActive style={planeStyles.flyRight} />
                Operator 1
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="3" tooltip="Operator 2" style={{ textAlign: 'center' }}>
                <AirPlaneModeActive style={planeStyles.flyLeft} />
                Operator 2
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Event Description</TableHeaderColumn>
              <TableHeaderColumn>Local Airport</TableHeaderColumn>
              <TableHeaderColumn>Proximity</TableHeaderColumn>
              <TableHeaderColumn>Operator Type</TableHeaderColumn>
              <TableHeaderColumn>Flight Phase</TableHeaderColumn>
              <TableHeaderColumn>Altitude</TableHeaderColumn>
              <TableHeaderColumn>Operator Type</TableHeaderColumn>
              <TableHeaderColumn>Flight Phase</TableHeaderColumn>
              <TableHeaderColumn>Altitude</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {props.modalEventData.map((d, i) => {
              const proximity = d.operator1.altitude && d.operator2.altitude ?
                Math.abs(d.operator1.altitude - d.operator2.altitude) : '';
              return (<TableRow key={d.reportNumber} style={{ ...getStripedStyle(i) }}>
                <TableRowColumn>{formatDate(new Date(d.eventDate), 'm/d/y')}</TableRowColumn>
                <TableRowColumn>{d.eventDesc}</TableRowColumn>
                <TableRowColumn>{d.localAirport}</TableRowColumn>
                <TableRowColumn>{proximity}</TableRowColumn>
                <TableRowColumn>{d.operator1.operatorType}</TableRowColumn>
                <TableRowColumn>{d.operator1.flightPhase}</TableRowColumn>
                <TableRowColumn>{d.operator1.altitude}</TableRowColumn>
                <TableRowColumn>{d.operator2.operatorType}</TableRowColumn>
                <TableRowColumn>{d.operator2.flightPhase}</TableRowColumn>
                <TableRowColumn>{d.operator2.altitude}</TableRowColumn>
              </TableRow>);
            })}
          </TableBody>
        </Table>
      </Dialog>
    </div>
  );
};

// https://www.reddit.com/r/javascript/comments/20zx5n/why_doesnt_javascript_have_a_native_date/
function formatDate(date, format) {
  const localDate = date.toJSON().split(/[:/.TZ-]/);
  return format.replace(/[ymdhis]/g, letter => localDate['ymdhis'.indexOf(letter)]);
}

function getStripedStyle(index) {
  return { background: index % 2 ? '#efefef' : 'white' };
}

export default DetailModal;
