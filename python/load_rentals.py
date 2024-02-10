import pandas as pd
import re
from geopy.geocoders import Nominatim, bing

# Load current dataset of short term rentals in Durango
current_strs_link = "https://docs.google.com/spreadsheets/d/1a6xGTTsSJPV-mqDTFTghqAaY9AYq5Y7OoXLbkJn-_uM/edit#gid=0".replace('/edit#gid=', '/export?format=csv&gid=')
current_strs_df = pd.read_csv(current_strs_link, index_col = 0)

# Function to get latitude and longitude
# index is needed to specify a unique user agent value
def get_lat_lon(address, index):

	if address == "nan" or address == "" or pd.isna(address):
		return None, None

	# Remove unit numbers from Address
	pattern = r'\s#\S+$'
	cleaned_address = re.sub(pattern, '', address)

	full_address = cleaned_address + ", Durango, CO"
	geolocator = Nominatim(user_agent="durango-str-tracker-"+ str(index), timeout=15000)
	location = geolocator.geocode(full_address, namedetails=True)
	if location:
	    return location.latitude, location.longitude
	else:
	    return None, None

for index, row in current_strs_df.iterrows():
	lat, lon = get_lat_lon(row['Address'], index)
	current_strs_df.at[index, 'Latitude'] = lat
	current_strs_df.at[index, 'Longitude'] = lon

current_strs_df.to_csv('src/data/vacation_rentals.csv', index=False)
current_strs_df.to_json('src/data/vacation_rentals.json', orient='records')