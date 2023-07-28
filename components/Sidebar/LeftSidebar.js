import React, { Component } from 'react';
import { connect } from 'react-redux';
import he from 'he';
const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import 'rc-slider/assets/index.css';

class LeftSidebar extends Component {
    state = {
        open: "",
        filtersValues: [],
    }

    componentDidMount() {
        if (window.innerWidth > 992) {
            let elementId = document.getElementById("fixed-filter-sidebar");
            document.addEventListener("scroll", () => {
                if (window.scrollY > 170) {
                    elementId.classList.add("sticky-top");
                    var socialFloat = document.querySelector('#fixed-filter-sidebar');
                    var footer = document.querySelector('.scroll-h');

                    function checkOffset() {
                        function getRectTop(el) {
                            var rect = el.getBoundingClientRect();
                            return rect.top;
                        }
                        if (socialFloat) {
                            if ((getRectTop(socialFloat) + document.body.scrollTop) + socialFloat.offsetHeight >= (getRectTop(footer) + document.body.scrollTop) - 10) {
                                elementId.classList.remove("sticky-top");
                            }
                        }
                    }
                    checkOffset();

                } else {
                    elementId.classList.remove("sticky-top");
                }
            });
        }
        if (window.innerWidth < 1200) {
            this.setState({
                isMobile: true,
            });
        }
        window.addEventListener('resize', () => {
            this.setState({
                isMobile: window.innerWidth < 1200
            });
        }, false);
        
        this.handleDefaultFilter();
    }

    componentDidUpdate(oldProps) {
        const { router: { asPath } } = this.props;
        if(asPath !== oldProps.router.asPath) {
            this.handleDefaultFilter();
        }
    }

    handleDefaultFilter = () => {
        const { router: { query: { color } }, filters } = this.props;
        let getColor = {};
        if(color) {
            getColor = filters.find(f => f.label === "Color Category");
            this.handleToggle(null, getColor.label);
            const filter = getColor.option.find(o => o.label === color);
            this.handleFilter(null, filter.value, filter.label, getColor.attribute_code);
        } else {
            this.setState({ filtersValues: [] })
        }
    }

    handleToggle = (e, label) => {
        if(e) {
            e.preventDefault();
        }

        if (this.state.open !== label) {
            this.setState({ open: label });
        } else {
            this.setState({ open: "" });
        }
    }

    handleFilter = (e, value, label, attr) => {
        if(e) {
            e.preventDefault();
        }
        let filters = JSON.parse(JSON.stringify(this.state.filtersValues));
        const index = filters.findIndex(fil => fil.attr === attr);
        if (attr === "price") {
            if (index === -1) {
                const data = {
                    values: [...value],
                    labels: [label],
                    attr
                };
                filters.push(data);
            } else {
                filters[index].values = [...value];
            }
        } else {
            if (index > -1) {
                const i = filters[index].values.indexOf(value);
                if (i > -1) {
                    filters[index].values.splice(i, 1);
                    filters[index].labels.splice(i, 1);
                    if (filters[index].values.length === 0) {
                        filters.splice(index, 1);
                    }
                } else {
                    filters[index].values.push(value);
                    filters[index].labels.push(label);
                }
            } else {
                const data = {
                    values: [value],
                    labels: [label],
                    attr
                };
                filters.push(data);
            }
        }
        this.setState({ filtersValues: filters });
        this.props.handleQuery(filters);
    }

    removeFilter = (i, j) => {
        let filters = JSON.parse(JSON.stringify(this.state.filtersValues));
        filters[i].values.splice(j, 1);
        filters[i].labels.splice(j, 1);
        if (filters[i].values.length === 0) {
            filters.splice(i, 1);
        }
        this.setState({ filtersValues: filters });
        this.props.handleQuery(filters);
    }

    handleClear = () => {
        this.setState({ filtersValues: [] });
        this.props.clearQuery();
    }

    render() {
        const { open, filtersValues } = this.state;
        const { filters } = this.props;
        return (
            <div className="col-sm-12">
                <div id="fixed-filter-sidebar" className="woocommerce-sidebar-area">
                    {filters &&
                        <div className={"collapse-widget filter-list-widget open"}>
                            <h3 className="collapse-widget-title active">
                                Current Selection
                            </h3>
                            <div className="selected-filters-wrap-list">
                                <ul>
                                    {filtersValues.map((fil, i) =>
                                        fil.labels.map((l, j) =>
                                            <li key={l} onClick={() => this.removeFilter(i, j)}><a>{he.decode(l)}</a></li>
                                        )
                                    )}
                                </ul>
                                {filtersValues.length > 0 &&
                                    <div className="delete-selected-filters">
                                        <a onClick={this.handleClear}><i className="far fa-trash-alt"></i> <span>Clear All</span></a>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {filters && filters.length > 0 && filters.filter(x => (x.label !== "Category")).map((e, i) => {
                        const index = filtersValues.findIndex(fil => fil.attr === e.attribute_code);
                        let selectedFilterValues = [];
                        let maxPrice = 0;
                        if (index >= 0) {
                            selectedFilterValues = filtersValues[index].values;
                        }
                        if (e.label === "Sort by Price") {
                            maxPrice = e.option[e.option.length - 1].label;
                            maxPrice = parseInt(maxPrice.split("$")[1]);
                        }
                        return (
                            <div
                                key={i}
                                className={`collapse-widget collections-list-widget ${open === e.label ? '' : 'open'}`}
                            >
                                <h3
                                    className={`collapse-widget-title ${open === e.label ? '' : 'active'}`}
                                    onClick={ev => this.handleToggle(ev, e.label)}
                                >
                                    {e.label}
                                    <i className="fas fa-angle-up"></i>
                                </h3>

                                <ul className={`collections-list-row ${open === e.label ? 'block' : 'none'}`}>
                                    {e.label === "Sort by Price" ?
                                        <>
                                            <Range
                                                className="price-slider"
                                                min={0}
                                                max={maxPrice}
                                                allowCross={false}
                                                defaultValue={selectedFilterValues.length > 0 ? selectedFilterValues : [0, maxPrice]}
                                                onAfterChange={(evt) => this.handleFilter(null, evt, `$${evt[0]} - $${evt[1]}`, e.attribute_code)}
                                            />
                                            <span className="range-labels d-flex justify-content-between">
                                                <label>$0.00</label>
                                                <label>${parseFloat(maxPrice).toFixed(2)}</label>
                                            </span>
                                        </>
                                        :
                                        e.option.map(opt => {
                                            const checked = selectedFilterValues.findIndex(sfv => sfv === opt.value) > -1;
                                            return (
                                                <li key={opt.label} className="d-flex align-items-center">
                                                    <input className="mr-2" type="checkbox" value={opt.value} checked={checked} onChange={(evt) => this.handleFilter(evt, opt.value, opt.label, e.attribute_code)} />
                                                    <a onClick={(ev) => this.handleFilter(ev, opt.value, opt.label, e.attribute_code)}>{he.decode(opt.label)}</a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        filters: state.categoryReducer.filters
    }
}

export default connect(mapStateToProps, null)(LeftSidebar);
