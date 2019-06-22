import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  deleteCohortStretchThunk,
  updateCohortStretchThunk
} from '../../store/cohort-stretches/actions'
import { openStretchProcessThunk } from '../../store/shared-actions'
import { checkIfAllDataExists } from '../../utilityfunctions'

import StretchScheduler from '../_shared/StretchScheduler'
import ConfirmDialogBox from '../_shared/ConfirmDialogBox'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import SingleTable from './SingleTable'
import { formatCohortStretch } from '../StudentHomeView/helperfunctions'

const SingleCohortStretchTables = ({
  cohort,
  cohortStretches,
  stretches,
  deleteCohortStretch,
  updateCohortStretch,
  openStretchProcess
}) => {
  if (!checkIfAllDataExists(cohort, cohortStretches, stretches)) {
    return <div>No open, scheduled, or submitted stretches for cohort</div>
  }

  let [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  let [unscheduleModalOpen, setunscheduleModalOpen] = useState(false)
  let [openStretchModalOpen, setOpenStretchModalOpen] = useState(false)
  let [selectedCohortStretch, setCohortStretch] = useState({})
  let [selectedCohortStretchId, setCohortStretchId] = useState('')

  const thisCohortStretches =
    cohortStretches.filter(
      cohortStretch => cohortStretch.cohortId === cohort.id
    ) || []
  const openCohortStretches =
    thisCohortStretches
      .filter(cohortStretches => cohortStretches.status === 'open')
      .map(cs => formatCohortStretch(cs, stretches)) || []
  const closedCohortStretches =
    thisCohortStretches
      .filter(cohortStretches => cohortStretches.status === 'closed')
      .map(cs => formatCohortStretch(cs, stretches)) || []
  const scheduledCohortStretches =
    thisCohortStretches
      .filter(cohortStretches => cohortStretches.status === 'scheduled')
      .map(cs => formatCohortStretch(cs, stretches)) || []
  const groupedStretches = {
    open: openCohortStretches,
    scheduled: scheduledCohortStretches,
    closed: closedCohortStretches
  }

  // StretchScheduler modal event handlers
  const handleRescheduleModalClose = () => setRescheduleModalOpen(false)
  const handleRescheduleModalOpen = selectedCohortStretch => {
    setRescheduleModalOpen(true)
    setCohortStretch(selectedCohortStretch)
  }

  // Unschedule modal event handlers
  const handleunscheduleModalClose = () => setunscheduleModalOpen(false)
  const handleunscheduleModalOpen = id => {
    setunscheduleModalOpen(true)
    setCohortStretchId(id)
  }

  // open stretch modal event handlers
  const handleopenStretchModalClose = () => setOpenStretchModalOpen(false)
  const handleopenStretchModalOpen = cohortStretch => {
    setOpenStretchModalOpen(true)
    setCohortStretch(cohortStretch)
    setCohortStretchId(cohortStretch.id)
  }

  const baseColumnNames = ['Title', 'Author', 'Category', 'Difficulty']
  const tableColumnNames = {
    open: baseColumnNames,
    scheduled: [...baseColumnNames, 'Scheduled Date'],
    closed: [...baseColumnNames, 'Date Used On ']
  }
  const baseDBColumnNames = [
    'title',
    'authorName',
    'categoryName',
    'difficulty'
  ]
  const dbColumnNames = {
    open: baseDBColumnNames,
    scheduled: [...baseDBColumnNames, 'scheduledDate'],
    closed: [...baseDBColumnNames, 'startTimer']
  }
  const tables = [
    { title: 'Open Stretches', key: 'open' },
    { title: 'Scheduled Stretches', key: 'scheduled' },
    { title: 'Closed Stretches', key: 'closed' }
  ]

  return (
    <div>
      <StretchScheduler
        open={rescheduleModalOpen}
        onClose={handleRescheduleModalClose}
        attributes={selectedCohortStretch}
        mode="update"
      />
      <ConfirmDialogBox
        text="Are you sure you would like to unschedule the stretch?"
        open={unscheduleModalOpen}
        setModalClosed={handleunscheduleModalClose}
        args={[selectedCohortStretchId]}
        action={deleteCohortStretch}
        showNoButton={true}
      />
      <ConfirmDialogBox
        text="Are you sure you would like to open the stretch?"
        open={openStretchModalOpen}
        setModalClosed={handleopenStretchModalClose}
        args={[
          stretches.find(s => s.id === selectedCohortStretch.stretchId),
          selectedCohortStretchId,
          { status: 'open', startTimer: new Date() }
        ]}
        action={openStretchProcess}
        showNoButton={true}
      />
      {tables.map(table => {
        const { key, title } = table
        return (
          <div key={key}>
            <Typography variant="h6" id="tableTitle">
              {title}
            </Typography>
            <SingleTable
              data={groupedStretches[key]}
              dbColumnNames={dbColumnNames[key]}
              tableColumnNames={tableColumnNames[key]}
            />
          </div>
        )
      })}

      {/*   <Typography variant="h6" id="tableTitle">
        Open Stretches
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Difficulty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {openCohortStretches.map(cohortStretch => {
            const { id, stretch } = cohortStretch
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link to={`/admin/singleStretch/${stretch.id}`}>
                    {stretch.title}
                  </Link>
                </TableCell>
                <TableCell>{stretch.authorName}</TableCell>
                <TableCell>{stretch.categoryName}</TableCell>
                <TableCell>{stretch.difficulty}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Typography variant="h6" id="tableTitle">
        Scheduled Stretches
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Scheduled Date</TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {scheduledCohortStretches.map(cohortStretch => {
            const { stretch } = cohortStretch
            return (
              <TableRow key={cohortStretch.id}>
                <TableCell>
                  <Link to={`/admin/singleStretch/${stretch.id}`}>
                    {stretch.title}
                  </Link>
                </TableCell>
                <TableCell>{stretch.authorName}</TableCell>
                <TableCell>{stretch.categoryName}</TableCell>
                <TableCell>{stretch.difficulty}</TableCell>
                <TableCell>
                  {moment
                    .utc(cohortStretch.scheduledDate)
                    .local()
                    .format('MMMM D, h:mm A')}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleopenStretchModalOpen(cohortStretch)}
                  >
                    {' '}
                    Open{' '}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => handleRescheduleModalOpen(cohortStretch)}
                  >
                    {' '}
                    Reschedule{' '}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    onClick={() => handleunscheduleModalOpen(cohortStretch.id)}
                  >
                    {' '}
                    Unschedule{' '}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Typography variant="h6" id="tableTitle">
        Closed Stretches
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {closedCohortStretches.map(cs => {
            const { id, stretch } = cs
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link to={`/admin/singleStretch/${stretch.id}`}>
                    {stretch.title}
                  </Link>
                </TableCell>
                <TableCell>{stretch.authorName}</TableCell>
                <TableCell>{stretch.categoryName}</TableCell>
                <TableCell>{stretch.difficulty}</TableCell>
                <TableCell>
                  <Link to={`/admin/stretch/analytics/${stretch.id}`}>
                    <Button color="primary"> View Analytics </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/admin/stretchReview/${id}`}>
                    <Button>Go To Classroom</Button>
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>*/}
    </div>
  )
}

const mapStateToProps = ({ cohortStretches, stretches }) => ({
  cohortStretches,
  stretches
})

const mapDispatchToProps = dispatch => {
  return {
    deleteCohortStretch: id => dispatch(deleteCohortStretchThunk(id)),
    updateCohortStretch: (id, updatedFields) =>
      dispatch(updateCohortStretchThunk(id, updatedFields)),
    openStretchProcess: (stretch, cohortStretchId, updatedFields) =>
      dispatch(openStretchProcessThunk(stretch, cohortStretchId, updatedFields))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleCohortStretchTables)
