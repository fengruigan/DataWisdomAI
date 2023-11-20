import React from "react";
import { Table } from "react-bootstrap";

const Message = ({content}) => {

    const formatResult = (data) => {
        const columns = [...Object.keys(data[0])]
        return <Table className='mt-1 mb-1'>
        <thead>
            <tr>
            <th key={-1}>#</th>
            {columns.map((col, idx) => <th key={idx}>{col}</th>)}
            </tr>
        </thead>
        <tbody>
            {data.map((d, idx) => {
            return <tr>
                <td key={idx}>{idx}</td>
                {columns.map((col, colIdx)=> <td key={colIdx}>{d[col]}</td>)}
            </tr>
            })}
        </tbody>
        </Table>
    }

    return <>
    <div className={content.type === "response" ? "primary-light Message" : "secondary-light Message"}>
        {(typeof content.body === 'object')? formatResult(content.body) : content.body}
    </div>
    {content.type === 'response' && <hr className="mb-4"/>}
    </>
}

export default Message;