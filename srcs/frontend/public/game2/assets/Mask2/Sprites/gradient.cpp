#include <opencv2/opencv.hpp>
#include <iostream>

using namespace cv;
using namespace std;

void blueToGreen(Mat& img) {
    // Check if the image has 4 channels (BGRA)
    if (img.channels() != 4) {
        cerr << "Error: Image does not have an alpha channel." << endl;
        return;
    }

    // Process each pixel
    for (int y = 0; y < img.rows; ++y) {
        for (int x = 0; x < img.cols; ++x) {
            Vec4b& pixel = img.at<Vec4b>(y, x);
            uchar& r = pixel[2];
            uchar& g = pixel[1];
            uchar& b = pixel[0];
            uchar& a = pixel[3];

            if (a > 0) {  // Only process non-transparent pixels
                // Normalize RGB values
                float r_normalized = r / 255.0f;
                float g_normalized = g / 255.0f;
                float b_normalized = b / 255.0f;

                // Calculate the blue ratio
                float total = r_normalized + g_normalized + b_normalized;
                float blue_ratio = (total > 0) ? b_normalized / total : 0.0f;

                // Transform blue intensity to green
                r = static_cast<uchar>(r_normalized * (1 - blue_ratio) * 255);
                g = static_cast<uchar>(blue_ratio * 255);
                b = static_cast<uchar>(b_normalized * (1 - blue_ratio) * 255);
            }
        }
    }
}

int main(int argc, char** argv) {
    if (argc != 3) {
        cout << "Usage: " << argv[0] << " <input_image> <output_image>" << endl;
        return -1;
    }

    // Read the image
    Mat img = imread(argv[1], IMREAD_UNCHANGED);
    if (img.empty()) {
        cerr << "Error: Unable to open the image file." << endl;
        return -1;
    }

    // Ensure the image has an alpha channel
    if (img.channels() != 4) {
        cerr << "Error: Image does not have an alpha channel." << endl;
        return -1;
    }

    // Apply the blue-to-green transformation
    blueToGreen(img);

    // Save the result
    if (!imwrite(argv[2], img)) {
        cerr << "Error: Unable to save the image." << endl;
        return -1;
    }
    cout << "Image saved as " << argv[2] << endl;

    return 0;
}
