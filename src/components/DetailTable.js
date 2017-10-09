import React from 'react';
import Table,
{
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from 'material-ui/Table';
import AirPlaneModeActive from 'material-ui-icons/AirplanemodeActive';

// https://www.reddit.com/r/javascript/comments/20zx5n/why_doesnt_javascript_have_a_native_date/
function formatDate(date, format) {
  const localDate = date.toJSON().split(/[:/.TZ-]/);
  return format.replace(/[ymdhis]/g, letter => localDate['ymdhis'.indexOf(letter)]);
}

function getStripedStyle(index) {
  return { background: index % 2 ? '#efefef' : 'white' };
}

const DetailTable = (props) => {
  const planeStyles = {
    flyRight: { transform: 'rotate(45deg)' },
    flyLeft: { transform: 'rotate(-45deg)' },
  };
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan="4" />
            <TableCell colSpan="3" style={{ textAlign: 'center' }}>
              <AirPlaneModeActive style={planeStyles.flyRight} />
              Operator 1
            </TableCell>
            <TableCell colSpan="3" style={{ textAlign: 'center' }}>
              <AirPlaneModeActive style={planeStyles.flyLeft} />
              Operator 2
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Event Description</TableCell>
            <TableCell>Local Airport</TableCell>
            <TableCell>Proximity</TableCell>
            <TableCell style={{ borderLeft: '1px solid #cacaca' }}>Operator Type</TableCell>
            <TableCell>Flight Phase</TableCell>
            <TableCell>Altitude</TableCell>
            <TableCell style={{ borderLeft: '1px solid #cacaca' }}>Operator Type</TableCell>
            <TableCell>Flight Phase</TableCell>
            <TableCell>Altitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.modalEventData.map((d, i) => {
            const proximity = d.operator1.altitude && d.operator2.altitude ?
              Math.abs(d.operator1.altitude - d.operator2.altitude) : '';
            return (<TableRow key={d.reportNumber} style={{ ...getStripedStyle(i) }}>
              <TableCell>{formatDate(new Date(d.eventDate), 'm/d/y')}</TableCell>
              <TableCell>{d.eventDesc}</TableCell>
              <TableCell>{d.localAirport}</TableCell>
              <TableCell>{proximity}</TableCell>
              <TableCell style={{ borderLeft: '1px solid #cacaca' }}>{d.operator1.operatorType}</TableCell>
              <TableCell>{d.operator1.flightPhase}</TableCell>
              <TableCell>{d.operator1.altitude}</TableCell>
              <TableCell style={{ borderLeft: '1px solid #cacaca' }}>{d.operator2.operatorType}</TableCell>
              <TableCell>{d.operator2.flightPhase}</TableCell>
              <TableCell>{d.operator2.altitude}</TableCell>
            </TableRow>);
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailTable;
