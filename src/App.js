import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Chart } from '@antv/g2';

function App() {
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const chartContainer = useRef();
  const LIMIT = 10;

  useEffect(() => {
    fetchProductsData(0);
  }, []);

  const changePage = (event) => {
    const page = event.target.getAttribute("data-page-number");
    var skip = 0;

    if (page !== 1) {
      skip = (page * LIMIT) - LIMIT;
    }
    fetchProductsData(skip);
  }

  const fetchProductsData = (skip) => {
    fetch(`https://dummyjson.com/products?limit=10&skip=${skip}`)
      .then(res => res.json())
      .then(data => {
        chartContainer.current.innerHTML = "";
        setTotalRecords(data.total);
        const dataArray = [];
        data.products.forEach(obj => {
          console.log(obj.id);
          const dataTable = {
            id: obj.id,
            brand: obj.brand,
            title: obj.title,
            price: obj.price,
            rating: obj.rating,
            category: obj.category,
            thumbnail: obj.thumbnail
          }

          dataArray.push(dataTable);
        });

        setTableData(dataArray);

        const chart = new Chart({
          container: 'myChart',
          autoFit: true,
          height: 500,
          padding: [40, 100, 80, 80]
        });
        chart.data(data.products);
        chart.scale()
        chart.scale('price', {
          range: [[0, 499], [500, 999], [1000, 1499], [1500, 2000]]
        });
        chart.coordinate('polar');
        chart.legend(false);
        chart.axis('brand', {
          grid: {
            alignTick: false,
            line: {
              style: {
                lineDash: [0, 0]
              },
            },
          },
        });
        chart
          .point()
          .adjust('jitter')
          .position('brand*type')
          .color('brand')
          .shape('circle')
          .style({
            fillOpacity: 0.85,
          })
        chart.render();
      });
  }

  const showData = (event) => {
    let id = event.currentTarget.getAttribute("data-product-id");
    let productDetails = tableData.find(item => item.id == id);
    setSelected(productDetails);
    setIsModelOpen(true);
  }

  return (
    <div className="App">
      {isModelOpen === true && (
        <div className='backDrop'>
          <div className='dataHolder'>
            <div className='header'>
              <div className='close' onClick={() => {
                setIsModelOpen(false);
                setSelected({});
              }}>close</div>
            </div>
            <div>
              {
                selected && (
                  <table>
                    <tr>
                      <td>{selected.brand}</td>
                    </tr>
                    <tr>
                      <td>{selected.title}</td>
                    </tr>
                    <tr>
                      <td>{selected.price}</td>
                    </tr>
                    <tr>
                      <td>{selected.rating}</td>
                    </tr>
                    <tr>
                      <td>{selected.category}</td>
                    </tr>
                    <tr>
                      <td>
                        <img src={selected.thumbnail} style={{ height: "80px", width: "100px" }} />
                      </td>
                    </tr>
                  </table>
                )
              }
            </div>
          </div>
        </div>
      )}

      <div ref={chartContainer} id="myChart"></div>
      <div className='mainWrapper'>
        <div className='dataTableContainer'>
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Title</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Category</th>
                <th>Thumbnail</th>
              </tr>
            </thead>

            <tbody>
              {
                tableData.map((item) => {
                  return (
                    <tr data-product-id={item.id} onClick={showData}>
                      <td>{item.brand}</td>
                      <td>{item.title}</td>
                      <td>{item.price}</td>
                      <td>{item.rating}</td>
                      <td>{item.category}</td>
                      <td>
                        <img style={{ height: "80px", width: "100px" }} src={item.thumbnail} />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className='paginationHolder'>

            {
              Array(totalRecords / 10).fill().map((i, index) => {
                return (<div data-page-number={index + 1} onClick={changePage} key={index} className='page-indecator'>{index + 1}</div>)
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
