import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column min-vh-100 justify-content-center">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <FaExclamationTriangle className="text-danger mb-4" style={{ fontSize: '5rem' }} />
          <h1 className="display-4 fw-bold">404 - Page Not Found</h1>
          <p className="lead text-muted mb-4">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/')}
              className="px-4 gap-3"
            >
              Go to Homepage
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => navigate(-1)}
              className="px-4"
            >
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;