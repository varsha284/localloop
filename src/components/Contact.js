import React, { useState } from 'react';
import * as FM from 'framer-motion';
const motion = FM; // alias for existing JSX usage
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    toast.success('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="page-contact page-container">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
            Contact Us
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#718096',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Have questions about LocalLoop? We'd love to hear from you.
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '2rem'
            }}>
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#4a5568'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#4a5568'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#4a5568'
                }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#4a5568'
                }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '2rem'
            }}>
              Get in Touch
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <i className="bi bi-envelope" style={{
                  fontSize: '1.5rem',
                  color: '#667eea',
                  marginRight: '1rem'
                }}></i>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2d3748',
                    margin: '0 0 0.25rem 0'
                  }}>
                    Email
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#718096'
                  }}>
                    support@localloop.com
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <i className="bi bi-telephone" style={{
                  fontSize: '1.5rem',
                  color: '#667eea',
                  marginRight: '1rem'
                }}></i>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2d3748',
                    margin: '0 0 0.25rem 0'
                  }}>
                    Phone
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#718096'
                  }}>
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <i className="bi bi-geo-alt" style={{
                  fontSize: '1.5rem',
                  color: '#667eea',
                  marginRight: '1rem'
                }}></i>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2d3748',
                    margin: '0 0 0.25rem 0'
                  }}>
                    Address
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#718096'
                  }}>
                    123 Community Street<br />
                    Neighborhood City, NC 12345
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <i className="bi bi-clock" style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                display: 'block'
              }}></i>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: '0 0 0.5rem 0'
              }}>
                Response Time
              </h3>
              <p style={{
                margin: 0,
                opacity: 0.9
              }}>
                We typically respond within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
