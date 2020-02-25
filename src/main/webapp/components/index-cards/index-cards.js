import React from 'react'

import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import EditIcon from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ErrorIcon from '@material-ui/icons/Error'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActionArea from '@material-ui/core/CardActionArea'
import Tooltip from '@material-ui/core/Tooltip'
import moment from 'moment'

import ConfirmDelete from '../confirm-delete'
import SharingModal from '../sharing/sharing-modal'
import Tooltip from '@material-ui/core/Tooltip'

const onClick = action => e => {
  e.preventDefault()
  e.stopPropagation()
  if (typeof action === 'function') {
    action(e)
  }
}

export const EditAction = props => {
  const { onEdit } = props
  return (
    <IconButton onClick={onClick(onEdit)}>
      <EditIcon />
    </IconButton>
  )
}
export const DuplicateAction = props => {
  const { onDuplicate } = props
  return (
    <IconButton onClick={onClick(onDuplicate)}>
      <Tooltip title="Duplicate">
        <FileCopyIcon />
      </Tooltip>
    </IconButton>
  )
}

export const DeleteAction = props => {
  const { onDelete, message, isWritable } = props
  return isWritable ? (
    <ConfirmDelete onDelete={onDelete}>{message}</ConfirmDelete>
  ) : null
}

export const ShareAction = props => {
  const { id, title, metacardType, isAdmin } = props
  return isAdmin ? (
    <SharingModal id={id} title={title} metacardType={metacardType} />
  ) : null
}

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    border: '1px solid #D3D3D3',
  },
}))(Tooltip)

export const ReadOnly = props => {
  const { isReadOnly, indexCardType } = props
  const readOnlyMessage =
    'This ' +
    indexCardType +
    ' is Read Only. This means you cannot change, delete or share this ' +
    indexCardType +
    '. Please duplicate this ' +
    indexCardType +
    ' or ask the owner for permissions to make changes.'
  return isReadOnly ? (
    <IconButton style={{ fontSize: '1.3rem' }}>
      <LightTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <ErrorIcon
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '.1rem',
                  }}
                />{' '}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '.3rem',
                  }}
                >
                  {readOnlyMessage}
                </div>
              </div>
            </Typography>
          </React.Fragment>
        }
      >
        <div>Read Only</div>
      </LightTooltip>
    </IconButton>
  ) : null
}

export const Actions = CardActions

const ItemContainer = props => {
  const { children, style, onClick } = props

  return (
    <Card
      style={{
        width: 345,
        margin: 20,
        cursor: 'pointer',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

export const AddCardItem = props => {
  const { onClick } = props

  return (
    <ItemContainer onClick={onClick}>
      <CardActionArea
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <AddCircleOutlineIcon style={{ width: '50%', height: '50%' }} />
      </CardActionArea>
    </ItemContainer>
  )
}

export const IndexCardItem = props => {
  const {
    headerAction,
    title,
    subHeader,
    metacard_owner,
    modified,
    children,
    onClick,
  } = props

  return (
    <ItemContainer onClick={onClick}>
      <CardActionArea component={'div'}>
        <CardHeader
          title={title}
          subheader={subHeader || moment(modified).fromNow()}
          action={headerAction}
        />
        <CardContent>
          {metacard_owner && (
            <Typography variant="body2" color="textSecondary" component="p">
              Owner: {metacard_owner}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      {children}
    </ItemContainer>
  )
}

export const IndexCards = props => {
  const { children } = props
  return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{children}</div>
}
