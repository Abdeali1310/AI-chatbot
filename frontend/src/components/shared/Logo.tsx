import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <div style={{display:"flex",marginRight:"auto",alignItems:"center",gap:"8px"}}>
        <Link to={"/"}>
            <img src='ai.png' alt='ai' width={'40px'} height={'40px'} className='image-inverted' />
            
        </Link>
        <Typography sx={{display: {md:"block",sm:"none",xs:"none"},mr:"auto",fontWeight:"800",textShadow:"2px 2px 20px #000"}}>
                <span style={{fontSize:"15px"}}>GPT</span>
            </Typography>
    </div>
  )
}

export default Logo