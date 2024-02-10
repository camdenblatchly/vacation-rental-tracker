import pandas as pd
import re
from geopy.geocoders import Nominatim, bing

# Load current dataset of short term rentals in Durango
current_strs_link = "https://docs.google.com/spreadsheets/d/1a6xGTTsSJPV-mqDTFTghqAaY9AYq5Y7OoXLbkJn-_uM/edit#gid=0".replace('/edit#gid=', '/export?format=csv&gid=')
current_strs_df = pd.read_csv(current_strs_link, index_col = 0)

# Load the vacation rental permit waitlist
# EN1 and EN2 are "Established Neighborhoods", and are 
# the only areas in the city where rentals are capped

en1_waitlist_link = "https://docs.google.com/spreadsheets/d/1OwsGPKexGXETfmEFWXqSwVzKVfVlwduIjumcoA88xVs/edit#gid=0".replace('/edit#gid=', '/export?format=csv&gid=')
en2_waitlist_link = "https://docs.google.com/spreadsheets/d/1OwsGPKexGXETfmEFWXqSwVzKVfVlwduIjumcoA88xVs/edit#gid=280148310".replace('/edit#gid=', '/export?format=csv&gid=')

en1_df = pd.read_csv(en1_waitlist_link, index_col=0)
en1_df["ZONE"] = "EN-1"
en2_df = pd.read_csv(en2_waitlist_link, index_col=0)
en2_df["ZONE"] = "EN-2"
waitlist_df = pd.concat([en1_df, en2_df], ignore_index=True)

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


# Loop through datasets and calculate Lat/Lon for all addresses
for index, row in current_strs_df.iterrows():
	lat, lon = get_lat_lon(row['Address'], index)
	current_strs_df.at[index, 'Latitude'] = lat
	current_strs_df.at[index, 'Longitude'] = lon

for index, row in waitlist_df.iterrows():
	lat, lon = get_lat_lon(row['Address'], index)
	waitlist_df.at[index, 'Latitude'] = lat
	waitlist_df.at[index, 'Longitude'] = lon


# Export to src/data folder
current_strs_df.to_json('src/data/vacation_rentals.json', orient='records')
waitlist_df.to_json('src/data/vacation_rentals_waitlist.json', orient='records')



