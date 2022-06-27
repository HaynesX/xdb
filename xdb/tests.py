from django.test import TestCase

# Create your tests here.



class ViewRequestTestCase(TestCase):

    def test_hello_world_is_hello_world(self):
        # """Hello World"""

        varOne = "Hello World"

        self.assertEqual(varOne, "Hello World")