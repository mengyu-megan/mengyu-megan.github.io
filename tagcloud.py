# -*- coding: utf-8 -*-
"""
Created on Fri Nov  2 19:16:34 2018

@author: mengy
"""
# Start with loading all necessary libraries
import numpy as np
import pandas as pd
from os import path
from PIL import Image
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator

import matplotlib.pyplot as plt

# Load in the dataframe
df = pd.read_csv("test.csv", index_col=0)


wordcloud = WordCloud(width = 1600, height = 1600, 
                background_color ='white', 
                stopwords = stopwords, 
                min_font_size = 10).generate(str(df)) 
  
# plot the WordCloud image                        
plt.figure(figsize = (16, 16), facecolor = None) 
plt.imshow(wordcloud) 
plt.axis("off") 
plt.tight_layout(pad = 0) 
  
plt.show() 
