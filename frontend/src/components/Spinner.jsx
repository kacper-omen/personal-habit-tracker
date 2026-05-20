import {ClipLoader} from 'react-spinners'

const Spinner = ({loading}) => {
  const override = {
    display: 'block',
    margin: '200px auto',
    borderWidth: '6px'
  }

  return (
    <ClipLoader 
        color='#3b82f6'
        loading={loading}
        size={250}
        cssOverride={override}
    />
  )
}

export default Spinner