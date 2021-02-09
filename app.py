import numpy as np
from flask import render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///static/data/cannabis.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Retail_map = Base.classes.retail_map
City_dispo = Base.classes.city_dispo
County_sales = Base.classes.county_sales
Sales_yoy = Base.classes.sales_yoy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    # Return template and data
    return render_template("index.html")


@app.route("/retail_map")
def retail():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all retail store data
    results = session.query(Retail_map.dispensary_name, Retail_map.postal_city, Retail_map.county, Retail_map.full_address, Retail_map.long, Retail_map.lat).all()

    session.close()

    # Create a dictionary from row of data and append to a list of dictionaries
    dispensaries = []
    for name, city, county, address, longg, lat in results:
        dispensary_dict = {}
        dispensary_dict["name"] = name
        dispensary_dict["city"] = city
        dispensary_dict["county"] = county
        dispensary_dict["address"] = address
        dispensary_dict["coords"] = [str(lat), str(longg)]
        dispensaries.append(dispensary_dict)

    # turn the list of dicts into an array of objects
    return jsonify(dispensaries)


@app.route("/city_dispensaries")
def city():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all city data
    results = session.query(City_dispo.city, City_dispo.twenty_pop, City_dispo.nineteen_pop, City_dispo.long, City_dispo.lat, City_dispo.dispensary_count, City_dispo.population_per_dispensary, City_dispo.county).all()

    session.close()

    # Create a dictionary from row of data and append to a list of dictionaries
    city_stats = []
    for city, twen_pop, nine_pop, longg, lat, dispo_count, pop_per_dispo, county in results:
        city_dict = {}
        city_dict["city"] = city
        city_dict["twenty_pop"] = str(twen_pop)
        city_dict["nine_pop"] = str(nine_pop)
        city_dict["coords"] = [str(lat), str(longg)]
        city_dict["dispo_count"] = str(dispo_count)
        city_dict["pop_per_dispo"] = str(pop_per_dispo)
        city_dict["county"] = str(county)
        
        city_stats.append(city_dict)

    # turn the list of dicts into an array of objects
    return jsonify(city_stats)


@app.route("/county_sales")
def county():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all county sales data
    results = session.query(County_sales.county, County_sales.personal_income, County_sales.population, County_sales.per_capita_income, County_sales.dispensary_count, County_sales.population_per_dispensary, County_sales.sales, County_sales.sales_per_capita, County_sales.avg_sales_per_dispensary, County_sales.avg_sale_dispo_per_capita, County_sales.percent_of_sales_over_income, County_sales.lat , County_sales.long).all()

    session.close()

    # Create a dictionary from row of data and append to a list of dictionaries
    county_sales = []
    for county, personal_income, population, per_capita_income, dispensary_count, population_per_dispensary, sales, sales_per_capita, avg_sales_per_dispensary, avg_sale_dispo_per_capita, percent_of_sales_over_income, lat, longg in results:
        county_dict = {}
        county_dict["county"] = county
        county_dict["personal_income"] = str(personal_income)
        county_dict["population"] = str(population)
        county_dict["per_capita_income"] = str(per_capita_income)
        county_dict["dispensary_count"] = str(dispensary_count)
        county_dict["population_per_dispensary"] = str(population_per_dispensary)
        county_dict["sales"] = str(sales)
        county_dict["sales_per_capita"] = str(sales_per_capita)
        county_dict["avg_sales_per_dispensary"] = str(avg_sales_per_dispensary)
        county_dict["avg_sale_dispo_per_capita"] = str(avg_sale_dispo_per_capita)
        county_dict["percent_of_sales_over_income"] = str(percent_of_sales_over_income)
        county_dict["coords"] = [str(lat), str(longg)]
        county_sales.append(county_dict)

    # turn the list of dicts into an array of objects
    return jsonify(county_sales)

@app.route("/yearly_sales")
def yearly():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query all yearly sales data
    results = session.query(Sales_yoy.months, Sales_yoy.nineteen_sales, Sales_yoy.twenty_sales).all()

    session.close()

    # Create a dictionary from row of data and append to a list of dictionaries
    yearly_sales = []
    for month, nine_sales, twenty_sales in results:
        yearly_dict = {}
        yearly_dict["month"] = str(month)
        yearly_dict["nine_sales"] = str(nine_sales)
        yearly_dict["twenty_sales"] = str(twenty_sales)

        yearly_sales.append(yearly_dict)

    # turn the list of dicts into an array of objects
    return jsonify(yearly_sales)


if __name__ == '__main__':
    app.run(debug=True)

    
    
    