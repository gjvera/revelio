import React from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import ErrorMessage from '../network-retry/inline-retry'
import { useApolloFallback } from '../../react-hooks'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import FormLabel from '@material-ui/core/FormLabel'
import { getResultSetIds, getSources, saveFile } from './utils'

const exportOptions = gql`
  query ExportOptions($transformerType: String!) {
    exportOptions(transformerType: $transformerType) {
      id
      displayName
    }
  }
`

const useExportMutation = () => {
  const exportMutation = gql`
    mutation ExportResult($source: String!, $id: ID!, $transformer: String!) {
      exportResult(source: $source, id: $id, transformer: $transformer)
    }
  `
  return useMutation(exportMutation)
}

const useExportSetMutation = () => {
  const exportSetMutation = gql`
    mutation ExportResultSet(
      $transformer: String!
      $ids: [ID]!
      $srcs: [String]!
      $opts: Json
    ) {
      exportResultSet(
        transformer: $transformer
        ids: $ids
        srcs: $srcs
        opts: $opts
      )
    }
  `
  return useMutation(exportSetMutation)
}

const Container = props => {
  const transformerType =
    !props.zipped && props.resultsToExport.length > 1 ? 'query' : 'metacard'
  const { loading, error, data, refetch } = useQuery(exportOptions, {
    variables: { transformerType },
  })
  const [exportResult] = useExportMutation()
  const [exportResultSet] = useExportSetMutation()
  if (loading) {
    return <LinearProgress />
  }
  if (error) {
    return (
      <ErrorMessage onRetry={refetch} error={error}>
        Error getting export formats
      </ErrorMessage>
    )
  }
  const exportFormats = data.exportOptions
  return (
    <ResultExport
      {...props}
      exportFormats={exportFormats}
      handleClose={props.handleClose}
      exportResult={exportResult}
      exportResultSet={exportResultSet}
    />
  )
}

const ResultExport = props => {
  const {
    exportFormats,
    exportResult,
    resultsToExport,
    zipped,
    exportResultSet,
  } = props
  const [selectedFormat, setSelectedFormat] = React.useState('')
  const handleFormatChange = event => {
    setSelectedFormat(event.target.value)
  }

  const getExportFormatId = format => {
    const formatToExport = exportFormats.find(
      form => form.displayName === format
    )
    return formatToExport ? encodeURIComponent(formatToExport.id) : undefined
  }

  return (
    <React.Fragment>
      <FormLabel style={{ paddingBottom: '30px' }}>Export Format:</FormLabel>
      <TextField
        fullWidth
        select
        variant="outlined"
        label={selectedFormat === '' ? 'Select an export option' : ''}
        value={selectedFormat}
        style={{ marginBottom: '10px', marginTop: '10px' }}
        onChange={handleFormatChange}
      >
        {exportFormats.map((format, index) => {
          return (
            <MenuItem key={index} value={format.displayName}>
              <ListItemText primary={format.displayName} />
            </MenuItem>
          )
        })}
      </TextField>
      <Button
        disabled={selectedFormat === '' ? true : false}
        fullWidth
        onClick={async () => {
          const encodedTransformer = getExportFormatId(selectedFormat)
          const ids = getResultSetIds(resultsToExport)
          const srcs = getSources(resultsToExport)
          let res = null
          if (zipped) {
            res = await exportResultSet({
              variables: {
                transformer: 'zipCompression',
                ids,
                srcs,
                opts: {
                  transformerId: encodedTransformer,
                },
              },
            })
            const { type, fileName, buffer } = res.data.exportResultSet
            saveFile(type, fileName, buffer)
          } else if (resultsToExport.length > 1) {
            res = await exportResultSet({
              variables: {
                transformer: encodedTransformer,
                ids,
                srcs,
              },
            })
            const { type, fileName, buffer } = res.data.exportResultSet
            saveFile(type, fileName, buffer)
          } else {
            const result = resultsToExport[0]
            res = await exportResult({
              variables: {
                source: result.sourceId,
                id: result.attributes.id,
                transformer: encodedTransformer,
              },
            })
            const { type, fileName, buffer } = res.data.exportResult
            saveFile(type, fileName, buffer)
          }
          props.handleClose()
        }}
        color="primary"
        variant="contained"
        style={{ marginBottom: '10px' }}
      >
        Download
      </Button>
    </React.Fragment>
  )
}

export default props => {
  const Component = useApolloFallback(Container, ResultExport)
  return <Component {...props} />
}
